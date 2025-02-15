import { REDIRECT_USER_URL } from '@/config/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.auth()) {
		redirect(302, REDIRECT_USER_URL);
	}
};
