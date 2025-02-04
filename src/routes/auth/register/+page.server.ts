import { DEFAULT_REDIRECT_AUTHED_USER_URL } from '@/config/auth'
import { registerSchema } from '@/schemas/auth'
import { setSessionTokenCookie } from '@/server/auth/cookie'
import { createSession, generateSessionToken } from '@/server/auth/session'
import { createUser, isEmailTaken } from '@/server/auth/utils'
import { redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	await event.parent()

	const email = event.cookies.get('email') ?? null
	event.cookies.delete('email', { path: '/' })

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
			redirect(302, DEFAULT_REDIRECT_AUTHED_USER_URL)
		}

		const form = await superValidate(event, zod(registerSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		if (await isEmailTaken(form.data.email)) {
			return setError(form, 'email', 'Email already taken')
		}

		const newUser = await createUser(form.data)

		const sessionToken = generateSessionToken()
		const session = await createSession(sessionToken, newUser.id)
		setSessionTokenCookie(event, sessionToken, session.expiresAt)

		redirect(302, DEFAULT_REDIRECT_AUTHED_USER_URL)
	}
}
