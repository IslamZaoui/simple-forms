import { forgotPasswordSchema } from '@/schemas/auth';
import { auth } from '@/server/auth';
import { tryCatch } from '@/utils/helpers';
import { APIError } from 'better-auth/api';
import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	return {
		form: await superValidate(
			zod(forgotPasswordSchema, {
				defaults: {
					email: user?.email ?? ''
				}
			})
		)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(forgotPasswordSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await tryCatch(
			auth.api.forgetPassword({ body: { email: form.data.email, redirectTo: '/password/reset' } })
		);

		if (!result.success) {
			const { error } = result;
			if (error instanceof APIError) {
				console.log(error);
			}

			return setMessage(form, { type: 'error', message: 'Something went wrong' });
		}

		const { data } = result;
		if (!data.status) return setMessage(form, { type: 'error', message: 'Invalid email' });

		return setMessage(form, {
			type: 'success',
			message: 'Password reset email sent',
			description: 'if email exists, you will receive an email'
		});
	}
};
