import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Web Content Scraper and Markdown Converter</h1>
      
      <p className="mb-4">
        This application provides an API for scraping web content and converting it to markdown format.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">How to Use</h2>
      
      <h3 className="text-xl font-semibold mt-4 mb-2">API Endpoint</h3>
      <code className="bg-gray-100 p-2 rounded">GET /:url</code>
      <p className="mt-2">Replace <code>:url</code> with the URL you want to scrape, properly encoded.</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Examples</h3>
      
      <h4 className="text-lg font-semibold mt-3 mb-1">1. Plain Text Response</h4>
      <code className="bg-gray-100 p-2 rounded block">
        curl http://localhost:3000/https://www.example.com
      </code>

      <h4 className="text-lg font-semibold mt-3 mb-1">2. JSON Response</h4>
      <code className="bg-gray-100 p-2 rounded block">
        curl -H "Accept: application/json" http://localhost:3000/https://www.example.com
      </code>

      <h3 className="text-xl font-semibold mt-4 mb-2">Response Format</h3>
      
      <h4 className="text-lg font-semibold mt-3 mb-1">Plain Text Response</h4>
      <pre className="bg-gray-100 p-2 rounded">
{`Title: [Article Title]

URL Source: [Source URL]

Published Time: [Publication Time]

Markdown Content:
[Markdown content of the article]`}
      </pre>

      <h4 className="text-lg font-semibold mt-3 mb-1">JSON Response</h4>
      <pre className="bg-gray-100 p-2 rounded">
{`{
  "title": "Article Title",
  "url": "Source URL",
  "publishedTime": "Publication Time",
  "content": "Markdown content of the article"
}`}
      </pre>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Features</h2>
      <ul className="list-disc pl-6">
        <li>Scrapes web content and converts it to markdown</li>
        <li>Caches results for 1 hour to improve performance</li>
        <li>Supports special processing rules for specific domains (e.g., www.service-public.fr)</li>
        <li>Provides both JSON and plain text responses</li>
      </ul>
    </div>
  );
}