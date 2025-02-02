import { DEFAULT_REDIRECT_AUTHED_USER_URL } from '@/config/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.auth()) {
		redirect(302, DEFAULT_REDIRECT_AUTHED_USER_URL)
	}
}
