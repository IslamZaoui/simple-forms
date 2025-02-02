import { DEFAULT_REDIRECT_UNAUTHED_USER_URL } from '@/config/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const session = event.locals.auth()

	if (!session) {
		redirect(302, DEFAULT_REDIRECT_UNAUTHED_USER_URL)
	}

	return {
		user: session.user
	}
}
