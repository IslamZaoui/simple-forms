import { auth } from '@/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const session = event.locals.auth;
	if (session) {
		await auth.api.signOut({ headers: event.request.headers });
	}
	redirect(302, '/');
};
