import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { betterAuthSchema } from '@/schemas/auth';
import { betterAuth, type BetterAuthPlugin } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { parseSetCookieHeader } from 'better-auth/cookies';
import { createAuthMiddleware, openAPI } from 'better-auth/plugins';
import { validator as createValidator } from 'validation-better-auth';
import { prisma } from './database';
import {
	sendChangeEmailVerification,
	sendDeleteAccountVerification,
	sendPasswordResetEmail,
	sendVerificationEmail
} from './mail/emails';

const validator = createValidator(betterAuthSchema);

export const auth = betterAuth({
	appName: 'Simple Forms',
	baseURL: PUBLIC_APP_URL,
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
		async sendResetPassword(data) {
			await sendPasswordResetEmail(data.user.email, data.url);
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		async sendVerificationEmail(data) {
			await sendVerificationEmail(data.user.email, data.url);
		}
	},
	user: {
		changeEmail: {
			enabled: true,
			async sendChangeEmailVerification(data) {
				await sendChangeEmailVerification(data.user.email, data.newEmail, data.url);
			}
		},
		deleteUser: {
			enabled: true,
			async sendDeleteAccountVerification(data) {
				await sendDeleteAccountVerification(data.user.email, data.url);
			}
		}
	},
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET
		}
	},
	plugins: [openAPI(), sveltekitCookies(), validator]
});

function sveltekitCookies() {
	return {
		id: 'sveltekit-cookies',
		hooks: {
			after: [
				{
					matcher() {
						return true;
					},
					handler: createAuthMiddleware(async (ctx) => {
						const returned = ctx.context.responseHeaders;
						if ('_flag' in ctx && ctx._flag === 'router') {
							return;
						}
						if (returned instanceof Headers) {
							const setCookies = returned?.get('set-cookie');
							if (!setCookies) return;
							const parsed = parseSetCookieHeader(setCookies);
							const { getRequestEvent } = await import('$app/server');
							const cookieHelper = getRequestEvent().cookies;
							parsed.forEach((value, key) => {
								if (!key) return;
								try {
									cookieHelper.set(key, decodeURIComponent(value.value), {
										sameSite: value.samesite,
										secure: value.secure,
										maxAge: value['max-age'],
										httpOnly: value.httponly,
										domain: value.domain,
										path: value.path || '/'
									});
								} catch {
									// this will fail if the cookie is being set on client side
								}
							});
							return;
						}
					})
				}
			]
		}
	} satisfies BetterAuthPlugin;
}
