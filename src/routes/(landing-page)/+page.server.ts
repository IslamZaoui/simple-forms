import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	return await parent();
};

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		if (locals.auth) {
			redirect(302, '/app/dashboard');
		}

		const form = await request.formData();
		const email = form.get('email') as string | null;

		if (email) {
			cookies.set('email', email, { path: '/' });
		}

		redirect(302, '/auth/register');
	}
};
