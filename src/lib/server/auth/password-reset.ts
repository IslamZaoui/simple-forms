import { dev } from '$app/environment'
import { prisma } from '@/server/database'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeHexLowerCase } from '@oslojs/encoding'
import type { PasswordResetSession } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'
import { generateRandomOTP } from './utils'

export async function createPasswordResetSession(token: string, userId: string, email: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session: PasswordResetSession = {
		id: sessionId,
		userId,
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		code: generateRandomOTP(),
		emailVerified: false
	}
	await prisma.passwordResetSession.create({ data: session })
	return session
}

export async function validatePasswordResetSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session = await prisma.passwordResetSession.findUnique({
		where: { id: sessionId },
		include: {
			user: true
		}
	})

	if (!session) {
		return null
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await invalidateUserPasswordResetSessions(session.userId)
		return null
	}

	return session
}

export async function setPasswordResetSessionAsEmailVerified(sessionId: string) {
	await prisma.passwordResetSession.update({
		where: { id: sessionId },
		data: { emailVerified: true }
	})
}

export async function invalidateUserPasswordResetSessions(userId: string) {
	await prisma.passwordResetSession.deleteMany({ where: { userId } })
}

export async function validatePasswordResetSessionRequest(event: RequestEvent) {
	const token = event.cookies.get('password_reset_session') ?? null
	if (!token) {
		return null
	}

	const session = await validatePasswordResetSessionToken(token)
	if (!session) {
		deletePasswordResetSessionTokenCookie(event)
	}
	return session
}

export function setPasswordResetSessionTokenCookie(
	event: RequestEvent,
	token: string,
	expiresAt: Date
): void {
	event.cookies.set('password_reset_session', token, {
		expires: expiresAt,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		secure: !dev
	})
}

export function deletePasswordResetSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('password_reset_session', '', {
		maxAge: 0,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		secure: !dev
	})
}
