import { auth } from '@/server/auth';
import { createRateLimiter } from '@/server/rate-limiter';
import { formatSeconds } from '@/utils/time';
import { error, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({
		event,
		resolve,
		auth
	});
};

const handleUserSession: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	event.locals.auth = session;
	return resolve(event);
};

const limiter = createRateLimiter({
	prefix: 'global',
	rates: {
		IP: [100, 's'],
		IPUA: [40, 's']
	}
});

const handleRateLimit: Handle = async ({ event, resolve }) => {
	const state = await limiter.check(event);
	if (state.limited) {
		return error(429, `Too many requests, try again in ${formatSeconds(state.retryAfter)}.`);
	}

	return resolve(event);
};

export const handle = sequence(handleBetterAuth, handleUserSession, handleRateLimit);
