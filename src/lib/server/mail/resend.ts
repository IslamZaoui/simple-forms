import { building, dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { Resend } from 'resend'

let resend: Resend | undefined

if (!dev && !building && env.RESEND_API_KEY) {
	resend = new Resend(env.RESEND_API_KEY)
}

export { resend }
