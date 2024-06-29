import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { specialRules } from '@/utils/specialRules';
import NodeCache from 'node-cache';
import puppeteer from 'puppeteer';

const cache = new NodeCache({ stdTTL: 3600 });

const FAKE_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36';

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string[] } }
) {
  const fullUrl = params.url.join('/');
  const jsonMode = request.headers.get('Accept') === 'application/json';

  try {
    // Check cache first
    const cachedResult = cache.get(fullUrl);
    if (cachedResult) {
      return jsonMode
        ? NextResponse.json(cachedResult)
        : new NextResponse(formatResponse(cachedResult as ArticleResult), {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
    }

    console.log(`Fetching URL: ${fullUrl}`);
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(FAKE_USER_AGENT);
    
    await page.goto(fullUrl, { waitUntil: 'networkidle0' });
    
    const html = await page.content();
    console.log(`Received HTML content length: ${html.length}`);

    await browser.close();

    const dom = new JSDOM(html, { url: fullUrl });
    console.log('JSDOM instance created');

    const reader = new Readability(dom.window.document);
    console.log('Readability instance created');

    const article = reader.parse();
    console.log('Article parsed');

    if (!article) {
      throw new Error('Failed to parse article: Readability returned null');
    }

    console.log(`Article title: ${article.title}`);
    console.log(`Article content length: ${article.content.length}`);

    const turndownService = new TurndownService();
    let markdownContent = turndownService.turndown(article.content);
    console.log(`Markdown content length: ${markdownContent.length}`);

    // Apply special rules
    const urlObject = new URL(fullUrl);
    const domain = urlObject.hostname;
    if (domain in specialRules) {
      markdownContent = (specialRules as Record<string, (content: string) => string>)[domain](markdownContent);
      console.log(`Applied special rules for domain: ${domain}`);
    }

    const result: ArticleResult = {
      title: article.title,
      url: fullUrl,
      publishedTime: article.publishedTime || new Date().toISOString(),
      content: markdownContent,
    };

    // Store result in cache
    cache.set(fullUrl, result);
    console.log('Result stored in cache');

    if (jsonMode) {
      return NextResponse.json(result);
    } else {
      return new NextResponse(formatResponse(result), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('HTTP error! status:')) {
        statusCode = parseInt(error.message.split(':')[1].trim());
      } else if (error.message.includes('Failed to parse article')) {
        statusCode = 422; // Unprocessable Entity
      }
    }

    console.error(`Error details: ${errorMessage}`);
    
    if (jsonMode) {
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    } else {
      return new NextResponse(`Error: ${errorMessage}`, { status: statusCode, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  }
}

interface ArticleResult {
  title: string;
  url: string;
  publishedTime: string;
  content: string;
}

function formatResponse(result: ArticleResult): string {
  return `Title: ${result.title}\n\nURL Source: ${result.url}\n\nPublished Time: ${result.publishedTime}\n\nMarkdown Content:\n${result.content}`;
}