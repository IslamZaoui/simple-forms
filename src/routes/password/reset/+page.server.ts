import { resetPasswordSchema } from '@/schemas/auth';
import { auth } from '@/server/auth';
import { tryCatch } from '@/utils/helpers';
import { APIError } from 'better-auth/api';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const error = event.url.searchParams.get('error');
	if (error) {
		redirect('/password/forgot', { type: 'error', message: error }, event);
	}

	const token = event.url.searchParams.get('token');
	if (!token) {
		redirect('/password/forgot', { type: 'error', message: 'Invalid token' }, event);
	}

	return {
		form: await superValidate(zod(resetPasswordSchema), {
			defaults: {
				token,
				password: '',
				confirmPassword: ''
			}
		})
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(resetPasswordSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await tryCatch(
			auth.api.resetPassword({
				body: {
					token: form.data.token,
					newPassword: form.data.password
				}
			})
		);
		if (!result.success) {
			const { error } = result;
			if (error instanceof APIError) {
				switch (error.body?.code) {
					case 'INVALID_TOKEN':
						return redirect('/password/forgot', { type: 'error', message: 'Invalid token' }, event);
				}
				console.log(error);
			}

			return setMessage(form, { type: 'error', message: 'Something went wrong' });
		}

		const { data } = result;
		if (!data.status) return setMessage(form, { type: 'error', message: 'Invalid token' });

		if (event.locals.auth) {
			redirect(
				'/app/settings?tab=security#change-password',
				{
					type: 'success',
					message: 'You have successfully reset your password'
				},
				event
			);
		}

		redirect(
			'/auth/login',
			{
				type: 'success',
				message: 'You have successfully reset your password',
				description: 'you can now sign in with your new password'
			},
			event
		);
	}
};
