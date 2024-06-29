# Web Content Scraper and Markdown Converter

This Next.js application provides an API for scraping web content and converting it to markdown format. Inspired by Jina AI Reader, it's designed to handle high-volume requests efficiently, with features like caching and special rules for specific websites. The app utilizes Mozilla's Readability library to extract and parse content from web pages, with an optional Puppeteer-based scraping for JavaScript-heavy sites.

## Technology Stack

- Built with Next.js 14, utilizing the App Router for improved performance and easier routing
- TypeScript for type safety and better developer experience
- Node.js backend for efficient server-side operations
- Mozilla's Readability library for content extraction
- Optional Puppeteer integration for JavaScript-rendered content

## Features

- Scrapes web content and converts it to markdown
- Uses Mozilla's Readability library to extract the main content from web pages
- Optional Puppeteer-based scraping for JavaScript-heavy websites
- Caches results for 1 hour to improve performance
- Supports special processing rules for specific domains (e.g., www.service-public.fr)
- Provides both JSON and plain text responses
- Leverages Next.js 14 App Router for optimized routing and rendering

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/l4time/readability-app
   cd readability-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Usage

### API Endpoint

The main API endpoint is:

```
GET /:url
```

Replace `:url` with the URL you want to scrape, encoded properly.

### Query Parameters

- `usePuppeteer`: Set to `true` to use Puppeteer for JavaScript-rendered content. Default is `false`.

### Examples

1. Scrape a website using the default method and get a plain text response:
   ```
   curl http://localhost:3000/https://www.example.com
   ```

2. Scrape a website using Puppeteer and get a JSON response:
   ```
   curl -H "Accept: application/json" "http://localhost:3000/https://www.example.com?usePuppeteer=true"
   ```

### Response Format

#### Plain Text Response

```
Title: [Article Title]

URL Source: [Source URL]

Published Time: [Publication Time]

Markdown Content:
[Markdown content of the article]
```

#### JSON Response

```json
{
  "title": "Article Title",
  "url": "Source URL",
  "publishedTime": "Publication Time",
  "content": "Markdown content of the article"
}
```

## Mozilla Readability and Puppeteer

This app primarily uses Mozilla's Readability library, which is the same technology behind Firefox's Reader View. Readability removes clutter from web pages, leaving only the main content, which is then processed and converted to markdown.

For JavaScript-heavy websites where content is dynamically loaded, the app offers an optional Puppeteer-based scraping method. This can be activated by setting the `usePuppeteer` query parameter to `true`.

## Special Rules

The app includes special processing rules for certain domains. Currently, there's a rule for `www.service-public.fr` that trims content after a specific point.

To add more rules, modify the `specialRules.ts` file in the `utils` directory.

## Caching

Results are cached for 1 hour to improve performance and reduce load on target websites. Repeated requests for the same URL within this timeframe will return the cached result.

## Error Handling

The app includes basic error handling. If a scraping operation fails, it will return an appropriate error message with a corresponding status code.

## Performance Considerations

- By default, the app uses a simple fetch request to retrieve web content, which is less resource-intensive.
- Puppeteer is only loaded and used when explicitly requested via the `usePuppeteer` query parameter, helping to minimize CPU and memory usage for most requests.

## Inspiration

This project was inspired by Jina AI Reader, aiming to provide similar functionality with a focus on performance and scalability using Next.js 14.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.