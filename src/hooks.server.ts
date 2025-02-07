import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '@/server/auth/session'
import { type UserLimiterExtra, UserLimiterPlugin } from '@/server/rate-limiter/plugins'
import { UpstashRedisRateLimiterStore } from '@/server/rate-limiter/store'
import { redis } from '@/server/redis/upstash'
import { error, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { RateLimiter } from 'sveltekit-rate-limiter/server'

const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null

	if (token === null) {
		event.locals.auth = () => null
		return resolve(event)
	}

	const session = await validateSessionToken(token)

	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt)
	} else {
		deleteSessionTokenCookie(event)
	}

	event.locals.auth = () => session
	return resolve(event)
}

const limiter = new RateLimiter<UserLimiterExtra>({
	IP: [60, 'm'],
	IPUA: [20, 'm'],
	plugins: [new UserLimiterPlugin([120, 'm'])],
	store: redis ? new UpstashRedisRateLimiterStore(redis, 'global') : undefined
})

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	if (await limiter.isLimited(event, { userId: event.locals.auth()?.user.id })) {
		return error(429, `Too many requests`)
	}
	return resolve(event)
}

export const handle = sequence(authHandle, rateLimitHandle)
