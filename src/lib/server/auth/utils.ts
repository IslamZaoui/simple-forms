import { prisma } from '@/server/database'

export async function isEmailTaken(email: string) {
	const user = await prisma.user.findUnique({ where: { email } })
	return !!user
}
