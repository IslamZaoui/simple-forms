import z from 'zod'

export const name = z
	.string()
	.min(5, 'Name must be at least 5 characters long')
	.max(20, 'Name must be at most 50 characters long')
	.trim()
	.optional()

export const email = z
	.string({ required_error: 'Email is required' })
	.email('Invalid email address')
	.trim()

export const password = z
	.string({ required_error: 'Password is required' })
	.min(8, 'Password must be at least 8 characters long')
	.max(71, 'Password must be at most 71 characters long')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/\d/, 'Password must contain at least one number')
	.regex(/[\W_]/, 'Password must contain at least one special character')

export const registerSchema = z
	.object({
		name,
		email,
		password,
		confirmPassword: z.string({ required_error: 'Confirm password is required' })
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['password'] })
		}
	})

export const loginSchema = z.object({
	email,
	password,
	rememberMe: z.boolean().default(false)
})
