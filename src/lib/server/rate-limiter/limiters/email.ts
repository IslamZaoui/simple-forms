import { dev } from '$app/environment';
import { createRateLimiter } from '..';

export const verifyEmailRateLimiter = !dev
	? createRateLimiter({
			prefix: 'verify-email',
			rates: {
				IP: [5, '15m'],
				IPUA: [3, '15m']
			}
		})
	: undefined;

export const forgotPasswordRateLimiter = !dev
	? createRateLimiter({
			prefix: 'forgot-password',
			rates: {
				IP: [5, '15m'],
				IPUA: [3, '15m']
			}
		})
	: undefined;
