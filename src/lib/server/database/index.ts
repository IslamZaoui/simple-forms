import { PrismaClient, type User } from '@prisma/client';

export const prisma = new PrismaClient({
	omit: {
		user: {
			githubId: true,
			passwordHash: true
		}
	}
});

export type UserWithoutSecrets = Omit<User, 'githubId' | 'passwordHash'>;
