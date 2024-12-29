import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { searchParams } = new URL(request.url)
    const textprompt = searchParams.get('textprompt')

    if (!textprompt) {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.aicodegen.workers.dev/classification?textprompt=${encodeURIComponent(textprompt)}`)
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error classifying text:', error)
    return NextResponse.json({ error: 'Failed to classify text' }, { status: 500 })
  }
}

