import type { Redis } from '@upstash/redis'
import type { RateLimiterStore } from 'sveltekit-rate-limiter/server'

function RATE_LIMITER_KV(redis: Redis, prefix: string = 'default') {
	function generateKey(hash: string) {
		return `rate-limiter:${prefix}:${hash}`
	}

	function getAllKeys() {
		return redis.keys(`rate-limiter:${prefix}:*`)
	}

	return {
		get: async (hash: string) => redis.get<number>(generateKey(hash)),
		set: async (hash: string, value: number, ttl: number) =>
			redis.set(generateKey(hash), value, {
				px: ttl
			}),
		clear: async () => {
			const keys = await getAllKeys()
			if (keys.length > 0) {
				await redis.del(...keys)
			}
		}
	}
}

type RateLimiterKV = ReturnType<typeof RATE_LIMITER_KV>

export class UpstashRedisRateLimiterStore implements RateLimiterStore {
	private kv: RateLimiterKV

	constructor(redis: Redis, prefix: string) {
		this.kv = RATE_LIMITER_KV(redis, prefix)
	}

	async add(hash: string, ttl: number): Promise<number> {
		console.log('add', hash, ttl)
		const currentRate = (await this.kv.get(hash)) ?? 0
		await this.kv.set(hash, currentRate + 1, ttl)
		return currentRate + 1
	}

	async clear(): Promise<void> {
		await this.kv.clear()
	}
}
