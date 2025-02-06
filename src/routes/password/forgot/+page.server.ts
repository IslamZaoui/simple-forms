import { RESET_PASSWORD_VERIFY_EMAIL_URL } from '@/config/auth'
import { forgotPasswordSchema } from '@/schemas/post-auth'
import {
	createPasswordResetSession,
	invalidateUserPasswordResetSessions,
	setPasswordResetSessionTokenCookie
} from '@/server/auth/password-reset'
import { generateSessionToken } from '@/server/auth/session'
import { getUserByEmail } from '@/server/auth/user'
import { sendPasswordResetEmail } from '@/server/mail/password-reset'
import { redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent()

	return {
		form: await superValidate(
			zod(forgotPasswordSchema, {
				defaults: {
					email: user?.email ?? ''
				}
			})
		)
	}
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(forgotPasswordSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const existingUser = await getUserByEmail(form.data.email)
		if (!existingUser) {
			return setError(form, 'email', 'User not found')
		}

		await invalidateUserPasswordResetSessions(existingUser.id)
		const sessionToken = generateSessionToken()
		const session = await createPasswordResetSession(sessionToken, existingUser.id, form.data.email)
		await sendPasswordResetEmail(form.data.email, session.code)
		setPasswordResetSessionTokenCookie(event, sessionToken, session.expiresAt)

		redirect(302, RESET_PASSWORD_VERIFY_EMAIL_URL)
	}
}
