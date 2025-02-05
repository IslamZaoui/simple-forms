import { dev } from '$app/environment'
import type { EmailVerificationRequest } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'
import {
	deleteUserEmailVerificationRequest,
	getUserEmailVerificationRequest
} from './email-verification'

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	})
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.delete('session', { path: '/' })
}

export function setEmailVerificationRequestCookie(
	event: RequestEvent,
	request: EmailVerificationRequest
): void {
	event.cookies.set('email_verification', request.id, {
		httpOnly: true,
		path: '/',
		secure: !dev,
		sameSite: 'lax',
		expires: request.expiresAt
	})
}

export function deleteEmailVerificationRequestCookie(event: RequestEvent): void {
	event.cookies.delete('email_verification', { path: '/' })
}

export async function getUserEmailVerificationRequestFromCookie(event: RequestEvent) {
	const session = event.locals.auth()
	if (!session) {
		return null
	}

	const id = event.cookies.get('email_verification')
	if (!id) {
		return null
	}

	const request = await getUserEmailVerificationRequest(id, session.user.id)
	if (!request) {
		await deleteUserEmailVerificationRequest(session.user.id)
	}

	return request
}
