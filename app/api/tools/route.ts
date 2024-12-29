import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    const response = await fetch(`https://api.aicodegen.workers.dev/?query=${query}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    return NextResponse.json({ error: 'Failed to fetch AI tools' }, { status: 500 });
  }
}

