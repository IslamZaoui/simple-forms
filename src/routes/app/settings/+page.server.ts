import { changeEmailSchema, changeImageSchema, changeNameSchema, changePasswordSchema } from '@/schemas/settings';
import { auth } from '@/server/auth';
import { tryCatch } from '@/utils/helpers';
import { APIError } from 'better-auth/api';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad, RequestEvent } from './$types';

const availableTabs = ['general', 'security', 'danger'] as const;
const getSelectedTab = (tab: string | null) => {
	if (!tab) return 'general';
	return availableTabs.includes(tab as (typeof availableTabs)[number])
		? (tab as (typeof availableTabs)[number])
		: 'general';
};

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	return {
		selectedTab: getSelectedTab(event.url.searchParams.get('tab')),
		changeImageForm: await superValidate(zod(changeImageSchema)),
		changeNameForm: await superValidate(zod(changeNameSchema), {
			defaults: {
				name: user.name ?? undefined
			}
		}),
		changeEmailForm: await superValidate(zod(changeEmailSchema), {
			defaults: {
				email: user.email
			}
		}),
		changePasswordForm: await superValidate(zod(changePasswordSchema))
	};
};

const name = async (event: RequestEvent) => {
	const session = event.locals.auth;
	if (!session) {
		redirect(302, '/');
	}

	const form = await superValidate(event, zod(changeNameSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const result = await tryCatch(auth.api.updateUser({ header: event.request.headers, body: { name: form.data.name } }));
	if (!result.success) {
		const { error } = result;
		if (error instanceof APIError) {
			console.log(error);
		}
		return redirect({ type: 'error', message: 'Something went wrong' }, event);
	}

	redirect(
		{
			type: 'success',
			message: 'You have successfully changed your name'
		},
		event
	);
};

const email = async (event: RequestEvent) => {
	const session = event.locals.auth;
	if (!session) {
		redirect(302, '/');
	}

	const form = await superValidate(event, zod(changeEmailSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const result = await tryCatch(
		auth.api.changeEmail({
			headers: event.request.headers,
			body: {
				newEmail: form.data.email,
				callbackURL: '/app/settings'
			}
		})
	);
	if (!result.success) {
		const { error } = result;
		if (error instanceof APIError) {
			switch (error.body?.code) {
				case 'COULDNT_UPDATE_YOUR_EMAIL':
					return setError(form, 'email', 'Could not update your email');
			}
			console.log(error);
		}

		return redirect({ type: 'error', message: 'Something went wrong' }, event);
	}

	redirect(
		{
			type: 'success',
			message: 'Verification code has been sent to your email address'
		},
		event
	);
};

const password = async (event: RequestEvent) => {
	const session = event.locals.auth;
	if (!session) {
		redirect(302, '/');
	}

	const form = await superValidate(event, zod(changePasswordSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const result = await tryCatch(
		auth.api.changePassword({
			headers: event.request.headers,
			body: {
				currentPassword: form.data.currentPassword,
				newPassword: form.data.newPassword,
				revokeOtherSessions: form.data.logout
			}
		})
	);
	if (!result.success) {
		const { error } = result;
		if (error instanceof APIError) {
			switch (error.body?.code) {
				case 'INVALID_PASSWORD':
					return setError(form, 'currentPassword', 'Invalid password');
			}
			console.log(error);
		}

		return redirect({ type: 'error', message: 'Something went wrong' }, event);
	}

	return redirect(
		{
			type: 'success',
			message: 'You have successfully changed your password'
		},
		event
	);
};

const deleteAccount = async (event: RequestEvent) => {
	const session = event.locals.auth;
	if (!session) {
		redirect(302, '/');
	}

	const result = await tryCatch(
		auth.api.deleteUser({
			headers: event.request.headers,
			body: {
				callbackURL: '/'
			}
		})
	);
	if (!result.success) {
		const { error } = result;
		if (error instanceof APIError) {
			console.log(error);
		}

		return redirect({ type: 'error', message: 'Something went wrong' }, event);
	}

	redirect(
		{
			type: 'success',
			message: 'Deletion verification has been sent to your email address'
		},
		event
	);
};

export const actions: Actions = {
	name,
	email,
	password,
	deleteAccount
};
