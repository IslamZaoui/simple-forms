import { REDIRECT_AUTHED_USER_URL } from '@/config/auth'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	redirect(302, REDIRECT_AUTHED_USER_URL)
}
