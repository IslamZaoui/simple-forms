import { registerSchema } from '@/schemas/auth';
import { auth } from '@/server/auth';
import { tryCatch } from '@/utils/helpers';
import { APIError } from 'better-auth/api';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await event.parent();

	const email = event.cookies.get('email') ?? null;
	event.cookies.delete('email', { path: '/' });

	return {
		form: await superValidate(zod(registerSchema), {
			defaults: {
				name: '',
				email: email ?? '',
				password: '',
				confirmPassword: ''
			}
		})
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.auth) {
			redirect(302, '/app/dashboard');
		}

		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await tryCatch(
			auth.api.signUpEmail({
				body: form.data
			})
		);
		if (!result.success) {
			const { error } = result;
			if (error instanceof APIError) {
				switch (error.body?.code) {
					case 'USER_ALREADY_EXISTS':
						return setError(form, 'email', 'Email already taken');
				}
				console.log(error);
			}

			return setMessage(form, { type: 'error', message: 'Something went wrong' });
		}

		redirect(
			'/auth/login',
			{
				type: 'success',
				message: 'You have successfully registered',
				description: 'A confirmation email has been sent to your email address'
			},
			event
		);
	}
};
