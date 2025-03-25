import { APP_EMAIL } from '$env/static/private';
import { resend } from './resend';

export async function sendPasswordResetEmail(email: string, url: string) {
	if (!resend) {
		return console.log(`[Email] Password reset url sent to ${email}: ${url}`);
	}

	await resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Reset your password',
		text: `Your password reset url: ${url}`
	});
}

export async function sendVerificationEmail(email: string, url: string) {
	if (!resend) {
		return console.log(`[Email] Email Verification url sent to ${email}: ${url}`);
	}

	await resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Verify your email',
		text: `Your email verification url: ${url}`
	});
}

export async function sendChangeEmailVerification(email: string, newEmail: string, url: string) {
	if (!resend) {
		return console.log(`[Email] Change email to ${newEmail} Verification url sent to ${email}: ${url}`);
	}

	await resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Change your email',
		text: `Your change email to ${newEmail} verification url: ${url}`
	});
}

export async function sendDeleteAccountVerification(email: string, url: string) {
	if (!resend) {
		return console.log(`[Email] Delete account Verification url sent to ${email}: ${url}`);
	}

	await resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Delete your account',
		text: `Your delete account verification url: ${url}`
	});
}
