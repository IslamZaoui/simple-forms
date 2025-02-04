import { hashPassword } from '@/server/auth/password'
import { prisma } from '@/server/database'

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
