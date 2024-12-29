import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { prompt } = body

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(`https://api.aicodegen.workers.dev/ai?prompt=${encodeURIComponent(prompt)}`)
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
        controller.close()
      } catch (error) {
        console.error('Error generating blog post:', error)
        controller.error(error)
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

