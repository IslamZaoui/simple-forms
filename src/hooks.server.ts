import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from '@/server/auth/session';
import { createRateLimiter } from '@/server/rate-limiter';
import { formatSeconds } from '@/utils/time';
import { error, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;

	if (token === null) {
		event.locals.auth = () => null;
		return resolve(event);
	}

	const session = await validateSessionToken(token);

	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.auth = () => session;
	return resolve(event);
};

const limiter = createRateLimiter({
	prefix: 'global',
	rates: {
		IP: [100, 's'],
		IPUA: [40, 's']
	}
});

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	const state = await limiter.check(event);
	if (state.limited) {
		return error(429, `Too many requests, try again in ${formatSeconds(state.retryAfter)}.`);
	}

	return resolve(event);
};

export const handle = sequence(authHandle, rateLimitHandle);
