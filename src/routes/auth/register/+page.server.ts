import { REDIRECT_AFTER_REGISTER_URL, REDIRECT_USER_URL } from '@/config/auth'
import { registerSchema } from '@/schemas/auth'
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth/session'
import { createUser, isEmailTaken } from '@/server/auth/user'
import { createRateLimiter } from '@/server/rate-limiter'
import { redis } from '@/server/redis/upstash'
import { redirect } from 'sveltekit-flash-message/server'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

const limiter = redis
	? createRateLimiter(redis, {
			prefix: 'register',
			rates: {
				IP: [5, 'm'],
				cookie: [3, 'm']
			},
			preflight: true
		})
	: undefined

export const load: PageServerLoad = async (event) => {
	await event.parent()

	const email = event.cookies.get('email') ?? null
	event.cookies.delete('email', { path: '/' })

	await limiter?.cookieLimiter?.preflight(event)
	return {
		form: await superValidate(zod(registerSchema), {
			defaults: {
				email: email ?? '',
				password: '',
				confirmPassword: ''
			}
		})
	}
}

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.auth()) {
			redirect(302, REDIRECT_USER_URL)
		}

		const form = await superValidate(event, zod(registerSchema))
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
						description: `Try again in ${state.retryAfter}s`
					},
					{
						status: 429
					}
				)
			}
		}

		if (await isEmailTaken(form.data.email)) {
			return setError(form, 'email', 'Email already taken')
		}

		const newUser = await createUser(form.data)

		const sessionToken = generateSessionToken()
		const session = await createSession(sessionToken, newUser.id, {
			rememberMe: true
		})
		setSessionTokenCookie(event, sessionToken, session.expiresAt)

		redirect(
			REDIRECT_AFTER_REGISTER_URL,
			{
				type: 'success',
				message: 'You have successfully registered',
				description: 'Verify your email to continue'
			},
			event
		)
	}
}
