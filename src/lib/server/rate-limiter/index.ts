import { redis } from '@/server/redis/upstash'
import { RetryAfterRateLimiter, type Rate } from 'sveltekit-rate-limiter/server'
import { UpstashRedisRateLimiterStore } from './store'

export type RateLimiterCreatorRates = {
	IP: Rate | Rate[]
	IPUA?: Rate | Rate[] | undefined
}

export type RateLimiterCreatorOptions = {
	prefix: string
	rates: RateLimiterCreatorRates
}

export function createRateLimiter(options: RateLimiterCreatorOptions) {
	const { prefix, rates } = options
	return new RetryAfterRateLimiter({
		IP: rates.IP,
		IPUA: rates.IPUA,
		store: redis ? new UpstashRedisRateLimiterStore(redis, prefix) : undefined
	})
}
