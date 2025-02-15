import { dev } from '$app/environment';
import { prisma } from '@/server/database';
import type { EmailVerificationRequest } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { generateRandomOTP } from './utils';

export async function deleteUserEmailVerificationRequest(userId: string) {
	await prisma.emailVerificationRequest.deleteMany({
		where: {
			userId
		}
	});
}

export async function createEmailVerificationRequest(userId: string, email: string) {
	await deleteUserEmailVerificationRequest(userId);

	const code = generateRandomOTP();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

	return await prisma.emailVerificationRequest.create({
		data: {
			userId,
			email,
			code,
			expiresAt
		}
	});
}

export async function getUserEmailVerificationRequest(id: string, userId: string) {
	return await prisma.emailVerificationRequest.findUnique({
		where: {
			id,
			userId
		}
	});
}

export function setEmailVerificationRequestCookie(event: RequestEvent, request: EmailVerificationRequest): void {
	event.cookies.set('email_verification', request.id, {
		httpOnly: true,
		path: '/',
		secure: !dev,
		sameSite: 'lax',
		expires: request.expiresAt
	});
}

export function deleteEmailVerificationRequestCookie(event: RequestEvent): void {
	event.cookies.delete('email_verification', { path: '/' });
}

export async function getUserEmailVerificationRequestFromCookie(event: RequestEvent) {
	const session = event.locals.auth();
	if (!session) {
		return null;
	}

	const id = event.cookies.get('email_verification');
	if (!id) {
		return null;
	}

	const request = await getUserEmailVerificationRequest(id, session.user.id);
	if (!request) {
		await deleteUserEmailVerificationRequest(session.user.id);
	}

	return request;
}
