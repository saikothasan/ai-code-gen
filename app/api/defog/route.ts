import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { searchParams } = new URL(request.url)
    const sqlprompt = searchParams.get('sqlprompt')

    if (!sqlprompt) {
      return NextResponse.json({ error: 'SQL prompt is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.aicodegen.workers.dev/defog?sqlprompt=${encodeURIComponent(sqlprompt)}`)
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.text()

    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error) {
    logger.error('Error in SQL generation route:', error)
    return NextResponse.json({ error: 'Failed to generate SQL' }, { status: 500 })
  }
}

