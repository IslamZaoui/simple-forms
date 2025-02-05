import { REDIRECT_UNAUTHED_USER_URL } from '@/config/auth'
import { deleteSessionTokenCookie } from '@/server/auth/cookie'
import { invalidateSession } from '@/server/auth/session'
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
	const session = event.locals.auth()
	if (session) {
		deleteSessionTokenCookie(event)
		invalidateSession(session.id)
	}
	redirect(302, REDIRECT_UNAUTHED_USER_URL)
}
