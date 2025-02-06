import { prisma, type UserWithoutSecrets } from '@/server/database'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import type { Session } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'

export type SessionFlags = {
	rememberMe: boolean
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20)
	crypto.getRandomValues(bytes)
	const token = encodeBase32LowerCaseNoPadding(bytes)
	return token
}

export async function createSession(
	token: string,
	userId: string,
	flags: SessionFlags
): Promise<AuthData> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const sessionDuration = flags.rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24 * 1

	return await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + sessionDuration)
		},
		include: {
			user: true
		}
	})
}

export async function validateSessionToken(token: string): Promise<AuthData | null> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session = await prisma.session.findUnique({
		where: {
			id: sessionId
		},
		include: {
			user: true
		}
	})

	if (session === null) {
		return null
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } })
		return null
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				expiresAt: session.expiresAt
			}
		})
	}

	return session
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } })
}

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

export async function invalidateUserSessions(userId: string) {
	await prisma.session.deleteMany({ where: { userId } })
}

export type AuthData = Session & {
	user: UserWithoutSecrets
}
