import { hashPassword, verifyPasswordHash } from '@/server/auth/utils'
import { prisma } from '@/server/database'

export async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({ where: { email } })
}

export async function isEmailTaken(email: string) {
	const user = await prisma.user.findUnique({ where: { email } })
	return !!user
}

export async function createUser(data: { name?: string; email: string; password: string }) {
	const passwordHash = await hashPassword(data.password)
	return await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			passwordHash
		}
	})
}

export async function getValidUser(email: string, password: string) {
	const user = await prisma.user.findUnique({ where: { email } })

	if (!user) {
		return null
	}

	const isPasswordValid =
		!user.passwordHash || (await verifyPasswordHash(user.passwordHash, password))

	if (!isPasswordValid) {
		return null
	}

	return user
}

export async function updateUserVerifiedEmail(userId: string, email: string) {
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			email: email,
			emailVerified: true
		}
	})
}

export async function setUserAsEmailVerifiedIfEmailMatches(userId: string, email: string) {
	return await prisma.user.update({
		where: {
			id: userId,
			email
		},
		data: {
			emailVerified: true
		}
	})
}

export async function getUserPasswordHash(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { passwordHash: true }
	})

	return user?.passwordHash
}

export async function updateUserPassword(userId: string, password: string) {
	const passwordHash = await hashPassword(password)
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			passwordHash
		}
	})
}
