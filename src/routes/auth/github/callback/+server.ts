import {
	REDIRECT_AFTER_LOGIN_URL,
	REDIRECT_AFTER_REGISTER_URL,
	REDIRECT_GUEST_URL,
	REDIRECT_USER_URL
} from '@/config/auth'
import { setSessionTokenCookie } from '@/server/auth/cookie'
import { github } from '@/server/auth/oauth'
import { createSession, generateSessionToken } from '@/server/auth/session'
import { isEmailTaken } from '@/server/auth/user'
import { prisma } from '@/server/database'
import type { OAuth2Tokens } from 'arctic'
import { redirect } from 'sveltekit-flash-message/server'
import type { RequestHandler } from './$types'

type GithubEmail = {
	email: string
	primary: boolean
}

const getGithubEmail = async (accessToken: string): Promise<string> => {
	const response = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch user emails')
	}

	const emails: GithubEmail[] = await response.json()
	const primaryEmail = emails.find((email) => email.primary)

	if (!primaryEmail) {
		throw new Error('No primary email found')
	}

	return primaryEmail.email
}

type GithubUser = {
	id: number
	login: string
}

const getGithubUser = async (accessToken: string): Promise<GithubUser> => {
	const response = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch user details')
	}

	const user: GithubUser = await response.json()

	return {
		id: user.id,
		login: user.login
	}
}

export const GET: RequestHandler = async (event) => {
	if (event.locals.auth()) {
		redirect(302, REDIRECT_USER_URL)
	}

	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('github_oauth_state') ?? null

	if (code === null || state === null || (storedState === null && storedState !== state)) {
		redirect(
			REDIRECT_GUEST_URL,
			{
				type: 'error',
				message: 'Invalid OAuth state'
			},
			event
		)
	}

	let tokens: OAuth2Tokens
	try {
		tokens = await github.validateAuthorizationCode(code)
	} catch {
		redirect(
			REDIRECT_GUEST_URL,
			{
				type: 'error',
				message: 'Invalid OAuth code'
			},
			event
		)
	}

	let githubUser: GithubUser
	try {
		githubUser = await getGithubUser(tokens.accessToken())
	} catch (err) {
		redirect(
			REDIRECT_GUEST_URL,
			{
				type: 'error',
				message: (err as Error).message
			},
			event
		)
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			githubId: githubUser.id
		}
	})

	if (existingUser) {
		const sessionToken = generateSessionToken()
		const session = await createSession(sessionToken, existingUser.id, {
			rememberMe: true
		})
		setSessionTokenCookie(event, sessionToken, session.expiresAt)

		redirect(
			REDIRECT_AFTER_LOGIN_URL,
			{
				type: 'success',
				message: 'Signed in successfully',
				description: `Welcome back, ${existingUser.name}`
			},
			event
		)
	}

	let email: string
	try {
		email = await getGithubEmail(tokens.accessToken())
	} catch (err) {
		redirect(
			REDIRECT_GUEST_URL,
			{
				type: 'error',
				message: (err as Error).message
			},
			event
		)
	}

	if (await isEmailTaken(email)) {
		redirect(
			REDIRECT_GUEST_URL,
			{
				type: 'error',
				message: 'Email already taken',
				description: "Please sign in with your github's primary email."
			},
			event
		)
	}

	const user = await prisma.user.create({
		data: {
			githubId: githubUser.id,
			name: githubUser.login,
			email
		}
	})

	const sessionToken = generateSessionToken()
	const session = await createSession(sessionToken, user.id, {
		rememberMe: true
	})
	setSessionTokenCookie(event, sessionToken, session.expiresAt)

	redirect(
		REDIRECT_AFTER_REGISTER_URL,
		{
			type: 'success',
			message: 'Signed up successfully',
			description: `Verify your email to continue`
		},
		event
	)
}
