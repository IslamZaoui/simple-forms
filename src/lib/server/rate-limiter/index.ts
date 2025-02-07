import { RATE_LIMITER_SECRET } from '$env/static/private'
import type { Redis } from '@upstash/redis'
import { RetryAfterRateLimiter, type Rate } from 'sveltekit-rate-limiter/server'
import { UpstashRedisRateLimiterStore } from './store'

export type RateLimiterCreatorRates = {
	IP: Rate | Rate[]
	IPUA?: Rate | Rate[] | undefined
	cookie: Rate | Rate[]
}

export type RateLimiterCreatorOptions = {
	prefix: string
	rates: RateLimiterCreatorRates
	preflight?: boolean
}

export function createRateLimiter(redis: Redis, options: RateLimiterCreatorOptions) {
	const { prefix, rates, preflight } = options

	return new RetryAfterRateLimiter({
		IP: rates.IP,
		IPUA: rates.IPUA,
		cookie: {
			name: `${prefix}-rate-limiter`,
			secret: RATE_LIMITER_SECRET,
			rate: rates.cookie,
			preflight: preflight ?? false
		},
		store: redis ? new UpstashRedisRateLimiterStore(redis, prefix) : undefined
	})
}
