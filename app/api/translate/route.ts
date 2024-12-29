import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const body = await request.json()
    const { text, source_lang, target_lang } = body

    if (!text || !source_lang || !target_lang) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const response = await fetch('https://api.aicodegen.workers.dev/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, source_lang, target_lang }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error translating text:', error)
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 })
  }
}

