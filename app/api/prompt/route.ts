import { NextRequest, NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    const { searchParams } = new URL(request.url)
    const prompt = searchParams.get('prompt')

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.aicodegen.workers.dev/prompt?prompt=${encodeURIComponent(prompt)}`)
    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`)
    }
    const data = await response.text()
    return NextResponse.json({ generatedPrompt: data })
  } catch (error) {
    logger.error('Error generating prompt:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 })
  }
}

