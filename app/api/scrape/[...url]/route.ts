import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { specialRules } from '@/utils/specialRules';
import NodeCache from 'node-cache';

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

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

    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();

    const dom = new JSDOM(html, { url: fullUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Failed to parse article');
    }

    const turndownService = new TurndownService();
    let markdownContent = turndownService.turndown(article.content);

    // Apply special rules
    const urlObject = new URL(fullUrl);
    const domain = urlObject.hostname;
    if (domain in specialRules) {
      markdownContent = (specialRules as Record<string, (content: string) => string>)[domain](markdownContent);
    }

    const result: ArticleResult = {
      title: article.title,
      url: fullUrl,
      publishedTime: article.publishedTime || new Date().toISOString(),
      content: markdownContent,
    };

    // Store result in cache
    cache.set(fullUrl, result);

    if (jsonMode) {
      return NextResponse.json(result);
    } else {
      return new NextResponse(formatResponse(result), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    const errorMessage = `Failed to scrape and parse the URL: ${(error as Error).message}`;
    if (jsonMode) {
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    } else {
      return new NextResponse(errorMessage, { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
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