import z from 'zod'

export const verifyEmailSchema = z.object({
	code: z
		.string({ required_error: 'Code is required' })
		.length(6, 'Code must be 6 characters long')
		.regex(/^[A-Z0-9]+$/)
})
