import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { searchParams } = new URL(request.url)
    const imgprompt = searchParams.get('imgprompt')

    if (!imgprompt) {
      return NextResponse.json({ error: 'Image prompt is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.aicodegen.workers.dev/image?imgprompt=${encodeURIComponent(imgprompt)}`)
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    const data = await response.text()
    return NextResponse.json({ imageUrl: data })
  } catch (error) {
    logger.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}

