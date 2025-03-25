import { loginSchema } from '@/schemas/auth';
import { auth } from '@/server/auth';
import { tryCatch } from '@/utils/helpers';
import { APIError } from 'better-auth/api';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, setMessage, superValidate } from 'sveltekit-superforms';
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
		if (event.locals.auth) {
			redirect(302, '/app/dashboard');
		}

		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await tryCatch(auth.api.signInEmail({ body: form.data }));
		if (!result.success) {
			const { error } = result;
			if (error instanceof APIError) {
				switch (error.body?.code) {
					case 'INVALID_EMAIL_OR_PASSWORD':
						return setError(form, 'email', 'Invalid email or password');
					case 'EMAIL_NOT_VERIFIED':
						return setMessage(form, {
							type: 'error',
							message: 'Email not verified',
							description: 'A verification email has been sent to you'
						});
				}
				console.log(error);
			}

			return setMessage(form, { type: 'error', message: 'Something went wrong' });
		}

		redirect(
			'/app/dashboard',
			{
				type: 'success',
				message: 'You have successfully logged in'
			},
			event
		);
	}
};
