import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '@/server/auth/session'
import { createRateLimiter } from '@/server/rate-limiter'
import { redis } from '@/server/redis/upstash'
import { error, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

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

const limiter = redis
	? createRateLimiter(redis, {
			prefix: 'global',
			rates: {
				IP: [100, 'm'],
				IPUA: [60, 'm'],
				cookie: [300, 'm']
			},
			preflight: false
		})
	: undefined

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	if (limiter) {
		const state = await limiter.check(event)
		if (state.limited) {
			return error(429, `Too many requests, try again in ${state.retryAfter}s`)
		}
	}
	return resolve(event)
}

export const handle = sequence(authHandle, rateLimitHandle)
