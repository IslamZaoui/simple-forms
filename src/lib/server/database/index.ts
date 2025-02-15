import { dev } from '$app/environment';
import { PrismaClient, type User } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		omit: {
			user: {
				githubId: true,
				passwordHash: true
			}
		}
	});

if (dev) globalForPrisma.prisma = prisma;

export type UserWithoutSecrets = Omit<User, 'githubId' | 'passwordHash'>;
