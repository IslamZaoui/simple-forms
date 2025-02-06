import { APP_EMAIL } from '$env/static/private'
import { resend } from './resend'

export async function sendPasswordResetEmail(email: string, code: string) {
	await resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Reset your password',
		text: `Your password reset code is ${code}.`
	})
}
