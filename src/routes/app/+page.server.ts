import { REDIRECT_USER_URL } from '@/config/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await event.parent();
	redirect(302, REDIRECT_USER_URL);
};
