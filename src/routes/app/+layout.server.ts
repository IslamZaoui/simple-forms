import { REDIRECT_GUEST_URL, VERIFY_EMAIL_URL } from '@/config/auth';
import { prisma } from '@/server/database';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = event.locals.auth();

	if (!session) {
		redirect(302, REDIRECT_GUEST_URL);
	}

	if (!session.user.emailVerified) {
		redirect(302, VERIFY_EMAIL_URL);
	}

	const latestTemplates = await prisma.formTemplate.findMany({
		where: {
			userId: session.user.id
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 4
	});

	return {
		user: session.user,
		latestTemplates
	};
};
