import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '@/server/auth/session'
import { rateLimitHandle } from '@/server/rate-limiter'
import type { Handle } from '@sveltejs/kit'
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

export const handle = sequence(rateLimitHandle, authHandle)
