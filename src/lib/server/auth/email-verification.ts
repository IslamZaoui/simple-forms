import { prisma } from '@/server/database'
import { generateRandomOTP } from './utils'

export async function deleteUserEmailVerificationRequest(userId: string) {
	await prisma.emailVerificationRequest.deleteMany({
		where: {
			userId
		}
	})
}

export async function createEmailVerificationRequest(userId: string, email: string) {
	await deleteUserEmailVerificationRequest(userId)

	const code = generateRandomOTP()
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

	return await prisma.emailVerificationRequest.create({
		data: {
			userId,
			email,
			code,
			expiresAt
		}
	})
}

export async function getUserEmailVerificationRequest(id: string, userId: string) {
	return await prisma.emailVerificationRequest.findUnique({
		where: {
			id,
			userId
		}
	})
}
