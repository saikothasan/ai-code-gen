import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const body = await request.json()
    const { input, batchedInput } = body

    if (!input && !batchedInput) {
      return NextResponse.json({ error: 'Input or batchedInput is required' }, { status: 400 })
    }

    const response = await fetch('https://api.aicodegen.workers.dev/baai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, batchedInput }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error generating responses:', error)
    return NextResponse.json({ error: 'Failed to generate responses' }, { status: 500 })
  }
}

