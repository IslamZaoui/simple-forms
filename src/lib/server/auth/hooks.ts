import { deleteSessionTokenCookie, setSessionTokenCookie } from '@/server/auth/cookie'
import { validateSessionToken } from '@/server/auth/session'
import type { Handle } from '@sveltejs/kit'

export const authHandle: Handle = async ({ event, resolve }) => {
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
