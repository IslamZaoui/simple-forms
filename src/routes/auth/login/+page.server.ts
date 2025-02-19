import { REDIRECT_AFTER_LOGIN_URL, REDIRECT_USER_URL } from '@/config/auth';
import { loginSchema } from '@/schemas/auth';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth/session';
import { getValidUser } from '@/server/auth/user';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await event.parent();

	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.auth()) {
			redirect(302, REDIRECT_USER_URL);
		}

		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUser = await getValidUser(form.data.email, form.data.password);

		if (!existingUser) {
			return setError(form, 'email', 'Invalid email or password');
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id, {
			rememberMe: form.data.rememberMe
		});
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(
			REDIRECT_AFTER_LOGIN_URL,
			{
				type: 'success',
				message: 'You have successfully logged in'
			},
			event
		);
	}
};
