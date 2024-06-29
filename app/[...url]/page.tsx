'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Article {
  title: string;
  url: string;
  publishedTime: string;
  content: string;
}

export default function ScrapePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const url = params.url;
    if (!url) return;

    const fullUrl = Array.isArray(url) ? url.join('/') : url;
    fetch(`/api/scrape/${fullUrl}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: Article) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
        setLoading(false);
      });
  }, [params.url]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>URL: {article.url}</p>
      <p>Published Time: {article.publishedTime}</p>
      <pre>{article.content}</pre>
    </div>
  );
}