import { prisma, type UserWithoutSecrets } from '@/server/database'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import type { Session } from '@prisma/client'

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20)
	crypto.getRandomValues(bytes)
	const token = encodeBase32LowerCaseNoPadding(bytes)
	return token
}

export async function createSession(token: string, userId: string): Promise<AuthData> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

	return await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
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

export type AuthData = Session & {
	user: UserWithoutSecrets
}
