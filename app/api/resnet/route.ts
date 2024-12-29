import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { searchParams } = new URL(request.url)
    const imgurl = searchParams.get('imgurl')

    if (!imgurl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.aicodegen.workers.dev/resnet?imgurl=${encodeURIComponent(imgurl)}`)
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error classifying image:', error)
    return NextResponse.json({ error: 'Failed to classify image' }, { status: 500 })
  }
}

