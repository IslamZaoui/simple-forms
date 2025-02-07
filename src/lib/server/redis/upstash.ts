import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { Redis } from '@upstash/redis'

export const redis =
	!dev && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
		? new Redis({
				url: env.UPSTASH_REDIS_REST_URL,
				token: env.UPSTASH_REDIS_REST_TOKEN
			})
		: undefined
