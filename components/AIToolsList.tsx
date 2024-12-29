'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AITool {
  name: string;
  description: string;
  url: string;
  category: string;
}

export default function AIToolsList() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/tools?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Error fetching AI tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [query]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>
              <Badge>{tool.category}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{tool.description}</p>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Visit Website
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

