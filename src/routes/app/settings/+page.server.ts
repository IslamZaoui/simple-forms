import { REDIRECT_GUEST_URL, VERIFY_EMAIL_URL } from '@/config/auth'
import { changeEmailSchema, changeNameSchema, changePasswordSchema } from '@/schemas/settings'
import {
	createEmailVerificationRequest,
	setEmailVerificationRequestCookie
} from '@/server/auth/email-verification'
import {
	createSession,
	generateSessionToken,
	invalidateUserSessions,
	setSessionTokenCookie
} from '@/server/auth/session'
import { getUserPasswordHash, isEmailTaken, updateUserPassword } from '@/server/auth/user'
import { verifyPasswordHash } from '@/server/auth/utils'
import { prisma } from '@/server/database'
import { sendVerificationEmail } from '@/server/mail/email-verification'
import { createRateLimiter } from '@/server/rate-limiter'
import { formatSeconds } from '@/utils/time'
import { redirect } from 'sveltekit-flash-message/server'
import { fail, setError, setMessage, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad, RequestEvent } from './$types'

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent()

	return {
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
	}
}

const nameLimiter = createRateLimiter({
	prefix: 'change-name',
	rates: {
		IP: [5, 'm'],
		IPUA: [3, 'm']
	}
})

const name = async (event: RequestEvent) => {
	const session = event.locals.auth()
	if (!session) {
		redirect(302, REDIRECT_GUEST_URL)
	}

	const form = await superValidate(event, zod(changeNameSchema))
	if (!form.valid) {
		return fail(400, { form })
	}

	const status = await nameLimiter.check(event)
	if (status.limited) {
		return setMessage(form, {
			type: 'error',
			message: 'Too many requests',
			description: `Try again in ${status.retryAfter}s`
		})
	}

	await prisma.user.update({
		where: {
			id: session.user.id
		},
		data: {
			name: form.data.name
		}
	})

	redirect(
		{
			type: 'success',
			message: 'You have successfully changed your name'
		},
		event
	)
}

const emailLimiter = createRateLimiter({
	prefix: 'change-email',
	rates: {
		IP: [5, 'd'],
		IPUA: [3, 'd']
	}
})

const email = async (event: RequestEvent) => {
	const session = event.locals.auth()
	if (!session) {
		redirect(302, REDIRECT_GUEST_URL)
	}

	const form = await superValidate(event, zod(changeEmailSchema))
	if (!form.valid) {
		return fail(400, { form })
	}

	const status = await emailLimiter.check(event)
	if (status.limited) {
		return setMessage(form, {
			type: 'error',
			message: 'Too many requests',
			description: `Try again in ${formatSeconds(status.retryAfter)}`
		})
	}

	if (await isEmailTaken(form.data.email)) {
		return setError(form, 'email', 'Email already taken')
	}

	const request = await createEmailVerificationRequest(session.user.id, form.data.email)
	await sendVerificationEmail(form.data.email, request.code)
	setEmailVerificationRequestCookie(event, request)

	redirect(
		VERIFY_EMAIL_URL,
		{
			type: 'success',
			message: 'Verification code has been sent to your email address'
		},
		event
	)
}

const passwordLimiter = createRateLimiter({
	prefix: 'change-password',
	rates: {
		IP: [5, '30m'],
		IPUA: [3, '30m']
	}
})

const password = async (event: RequestEvent) => {
	const session = event.locals.auth()
	if (!session) {
		redirect(302, REDIRECT_GUEST_URL)
	}

	const form = await superValidate(event, zod(changePasswordSchema))
	if (!form.valid) {
		return fail(400, { form })
	}

	const status = await passwordLimiter.check(event)
	if (status.limited) {
		return setMessage(form, {
			type: 'error',
			message: 'Too many requests',
			description: `Try again in ${formatSeconds(status.retryAfter)}`
		})
	}

	const passwordHash = await getUserPasswordHash(session.user.id)
	if (!passwordHash) {
		return setError(form, 'currentPassword', 'Invalid password')
	}

	const validPassword = await verifyPasswordHash(passwordHash, form.data.currentPassword)
	if (!validPassword) {
		return setError(form, 'currentPassword', 'Invalid password')
	}

	if (form.data.logout) {
		await invalidateUserSessions(session.user.id)
	}

	await updateUserPassword(session.user.id, form.data.newPassword)

	const sessionToken = generateSessionToken()
	const newSession = await createSession(sessionToken, session.user.id, {
		rememberMe: true
	})
	setSessionTokenCookie(event, sessionToken, newSession.expiresAt)

	return redirect(
		{
			type: 'success',
			message: 'You have successfully changed your password'
		},
		event
	)
}

const deleteAccount = async (event: RequestEvent) => {
	const session = event.locals.auth()
	if (!session) {
		redirect(302, REDIRECT_GUEST_URL)
	}

	await prisma.user.delete({
		where: {
			id: session.user.id
		}
	})

	redirect(
		REDIRECT_GUEST_URL,
		{
			type: 'success',
			message: 'You have successfully deleted your account'
		},
		event
	)
}

export const actions: Actions = {
	name,
	email,
	password,
	deleteAccount
}
