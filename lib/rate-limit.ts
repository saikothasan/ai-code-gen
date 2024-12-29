import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

type RateLimitConfig = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig = {
    uniqueTokenPerInterval: 500,
    interval: 60,
  }
) {
  const ip = req.ip ?? '127.0.0.1'
  const redis = Redis.fromEnv()
  const tokenKey = `rate-limit:${ip}`

  const { uniqueTokenPerInterval = 500, interval = 60 } = config

  const [incrResponse, expireResponse] = await redis
    .multi()
    .incr(tokenKey)
    .expire(tokenKey, interval)
    .exec()

  // Typecast the responses explicitly to numbers
  const currentUsage = incrResponse as number

  const isRateLimited = currentUsage > uniqueTokenPerInterval

  if (isRateLimited) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  return null
}
