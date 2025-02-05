import { REDIRECT_AUTHED_USER_URL } from '@/config/auth'
import { github } from '@/server/auth/oauth'
import { redirect } from '@sveltejs/kit'
import { generateState } from 'arctic'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
	if (event.locals.auth()) {
		redirect(302, REDIRECT_AUTHED_USER_URL)
	}

	const state = generateState()
	const url = github.createAuthorizationURL(state, ['user:email'])

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	})

	redirect(302, url)
}
