import {
	FORGOT_PASSWORD_URL,
	REDIRECT_USER_URL,
	RESET_PASSWORD_VERIFY_EMAIL_URL
} from '@/config/auth'
import { resetPasswordSchema } from '@/schemas/post-auth'
import {
	deletePasswordResetSessionTokenCookie,
	invalidateUserPasswordResetSessions,
	validatePasswordResetSessionRequest
} from '@/server/auth/password-reset'
import {
	createSession,
	generateSessionToken,
	invalidateUserSessions,
	setSessionTokenCookie
} from '@/server/auth/session'
import { updateUserPassword } from '@/server/auth/user'
import { redirect } from 'sveltekit-flash-message/server'
import { fail, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const session = await validatePasswordResetSessionRequest(event)
	if (!session) {
		redirect(302, FORGOT_PASSWORD_URL)
	}
	if (!session.emailVerified) {
		redirect(302, RESET_PASSWORD_VERIFY_EMAIL_URL)
	}

	return {
		email: session.email,
		form: await superValidate(zod(resetPasswordSchema))
	}
}

export const actions: Actions = {
	default: async (event) => {
		const requestSession = await validatePasswordResetSessionRequest(event)
		if (!requestSession) {
			redirect(302, FORGOT_PASSWORD_URL)
		}
		if (!requestSession.emailVerified) {
			redirect(302, RESET_PASSWORD_VERIFY_EMAIL_URL)
		}

		const form = await superValidate(event, zod(resetPasswordSchema))
		if (!form.valid) {
			return fail(400, { form })
		}

		await invalidateUserPasswordResetSessions(requestSession.userId)
		await invalidateUserSessions(requestSession.userId)
		await updateUserPassword(requestSession.userId, form.data.password)

		const sessionToken = generateSessionToken()
		const session = await createSession(sessionToken, requestSession.userId, {
			rememberMe: true
		})
		setSessionTokenCookie(event, sessionToken, session.expiresAt)
		deletePasswordResetSessionTokenCookie(event)

		redirect(
			REDIRECT_USER_URL,
			{
				type: 'success',
				message: 'You have successfully reset your password'
			},
			event
		)
	}
}
