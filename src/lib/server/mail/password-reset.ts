import { APP_EMAIL } from '$env/static/private'
import { resend } from './resend'

export async function sendPasswordResetEmail(email: string, code: string) {
	if (!resend) {
		return console.log(`[Email] Password reset code sent to ${email}: ${code}`)
	}

	await resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Reset your password',
		text: `Your password reset code is ${code}.`
	})
}
