import { REDIRECT_GUEST_URL, REDIRECT_USER_URL } from '@/config/auth'
import { verifyEmailSchema } from '@/schemas/post-auth'
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequestCookie,
	deleteUserEmailVerificationRequest,
	getUserEmailVerificationRequestFromCookie,
	setEmailVerificationRequestCookie
} from '@/server/auth/email-verification'
import { invalidateUserPasswordResetSessions } from '@/server/auth/password-reset'
import { updateUserVerifiedEmail } from '@/server/auth/user'
import { sendVerificationEmail } from '@/server/mail/email-verification'
import { createRateLimiter } from '@/server/rate-limiter'
import { redis } from '@/server/redis/upstash'
import { formatSeconds } from '@/utils/time'
import { redirect } from 'sveltekit-flash-message/server'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

const limiter = redis
	? createRateLimiter(redis, {
			prefix: 'verify-email',
			rates: {
				IP: [5, '30m'],
				cookie: [3, '30m']
			},
			preflight: true
		})
	: undefined

export const load: PageServerLoad = async (event) => {
	const session = event.locals.auth()

	if (!session) {
		redirect(302, REDIRECT_GUEST_URL)
	}

	let request = await getUserEmailVerificationRequestFromCookie(event)
	if (!request || Date.now() >= request.expiresAt.getTime()) {
		if (session.user.emailVerified) {
			redirect(302, REDIRECT_USER_URL)
		}
		request = await createEmailVerificationRequest(session.user.id, session.user.email)
		await sendVerificationEmail(request.email, request.code)
		setEmailVerificationRequestCookie(event, request)
	}

	await limiter?.cookieLimiter?.preflight(event)
	return {
		email: request.email,
		form: await superValidate(event, zod(verifyEmailSchema))
	}
}

export const actions: Actions = {
	verify: async (event) => {
		if (!event.locals.auth()) {
			redirect(302, REDIRECT_GUEST_URL)
		}

		let request = await getUserEmailVerificationRequestFromCookie(event)
		if (!request) {
			redirect(302, REDIRECT_GUEST_URL)
		}

		const form = await superValidate(event, zod(verifyEmailSchema))
		if (!form.valid) {
			return fail(400, { form })
		}

		if (limiter) {
			const state = await limiter.check(event)
			if (state.limited) {
				return message(
					form,
					{
						type: 'error',
						message: 'Too many requests',
						description: `Try again in ${formatSeconds(state.retryAfter)}`
					},
					{
						status: 429
					}
				)
			}
		}

		if (Date.now() >= request.expiresAt.getTime()) {
			request = await createEmailVerificationRequest(request.userId, request.email)
			await sendVerificationEmail(request.email, request.code)
			return message(form, {
				type: 'error',
				message: 'Verification code has expired',
				description: 'A new verification code has been sent to your email address.'
			})
		}

		if (request.code !== form.data.code) {
			return setError(form, 'code', 'Invalid code')
		}

		await deleteUserEmailVerificationRequest(request.userId)
		await invalidateUserPasswordResetSessions(request.userId)
		deleteEmailVerificationRequestCookie(event)
		await updateUserVerifiedEmail(request.userId, request.email)

		redirect(
			REDIRECT_USER_URL,
			{
				type: 'success',
				message: 'You have successfully verified your email'
			},
			event
		)
	},
	resend: async (event) => {
		const session = event.locals.auth()
		if (!session) {
			redirect(302, REDIRECT_GUEST_URL)
		}

		let request = await getUserEmailVerificationRequestFromCookie(event)
		if (!request) {
			request = await createEmailVerificationRequest(session.user.id, session.user.email)
		} else {
			request = await createEmailVerificationRequest(session.user.id, request.email)
		}

		await sendVerificationEmail(request.email, request.code)
		setEmailVerificationRequestCookie(event, request)

		redirect(
			{
				type: 'success',
				message: 'Verification code has been sent to your email address'
			},
			event
		)
	}
}
