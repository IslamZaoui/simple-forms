import z from 'zod'
import { email, password } from './auth'

export const code = z
	.string({ required_error: 'Code is required' })
	.length(6, 'Code must be 6 characters long')
	.regex(/^[A-Z0-9]+$/)
	.trim()

export const verifyEmailSchema = z.object({
	code
})

export const forgotPasswordSchema = z.object({
	email
})

export const resetPasswordSchema = z
	.object({
		password,
		confirmPassword: z.string({ required_error: 'Confirm password is required' })
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['password'] })
		}
	})
