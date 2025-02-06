import { FORGOT_PASSWORD_URL, RESET_PASSWORD_URL } from '@/config/auth'
import { verifyEmailSchema } from '@/schemas/post-auth'
import {
	setPasswordResetSessionAsEmailVerified,
	validatePasswordResetSessionRequest
} from '@/server/auth/password-reset'
import { setUserAsEmailVerifiedIfEmailMatches } from '@/server/auth/user'
import { redirect } from 'sveltekit-flash-message/server'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const session = await validatePasswordResetSessionRequest(event)
	if (!session) {
		redirect(302, FORGOT_PASSWORD_URL)
	}

	if (session.emailVerified) {
		redirect(302, RESET_PASSWORD_URL)
	}

	return {
		email: session.email,
		form: await superValidate(zod(verifyEmailSchema))
	}
}

export const actions: Actions = {
	verify: async (event) => {
		const session = await validatePasswordResetSessionRequest(event)
		if (!session) {
			redirect(
				FORGOT_PASSWORD_URL,
				{
					type: 'error',
					message: 'Invalid password reset session'
				},
				event
			)
		}

		if (session.emailVerified) {
			redirect(302, RESET_PASSWORD_URL)
		}

		const form = await superValidate(event, zod(verifyEmailSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		if (session.code !== form.data.code) {
			return setError(form, 'code', 'Invalid code')
		}

		await setPasswordResetSessionAsEmailVerified(session.id)
		const emailMatches = await setUserAsEmailVerifiedIfEmailMatches(session.userId, session.email)
		if (!emailMatches) {
			return message(form, {
				type: 'error',
				message: 'Email does not match user',
				description: 'Please restart the password reset process'
			})
		}

		redirect(302, RESET_PASSWORD_URL)
	}
}
