import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { searchParams } = new URL(request.url)
    const audio_url = searchParams.get('audio_url')

    if (!audio_url) {
      return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.aicodegen.workers.dev/whisper?audio_url=${encodeURIComponent(audio_url)}`)
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error transcribing audio:', error)
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
  }
}

