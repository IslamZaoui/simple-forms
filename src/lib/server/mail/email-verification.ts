import { APP_EMAIL } from '$env/static/private'
import { resend } from './resend'

export async function sendVerificationEmail(email: string, code: string) {
	resend.emails.send({
		from: APP_EMAIL,
		to: email,
		subject: 'Verify your email',
		text: `Your verification code is ${code}.`
	})
}
