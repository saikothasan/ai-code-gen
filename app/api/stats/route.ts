import { NextResponse } from 'next/server';

// This is a mock implementation. In a real-world scenario, you'd fetch this data from a database.
const getToolStats = () => {
  return {
    prompt: { uses: 1250, avgResponseTime: 0.8 },
    translate: { uses: 980, avgResponseTime: 1.2 },
    image: { uses: 1500, avgResponseTime: 2.5 },
    whisper: { uses: 750, avgResponseTime: 3.0 },
    resnet: { uses: 600, avgResponseTime: 1.8 },
    defog: { uses: 850, avgResponseTime: 1.5 },
    classification: { uses: 1100, avgResponseTime: 0.9 },
    baai: { uses: 700, avgResponseTime: 2.2 },
    ai: { uses: 2000, avgResponseTime: 4.5 },
    code: { uses: 1800, avgResponseTime: 3.2 },
  };
};

export async function GET() {
  const stats = getToolStats();
  return NextResponse.json(stats);
}

