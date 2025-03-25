import { StandardAdapter } from 'validation-better-auth';
import z from 'zod';

export const name = z
	.string({ required_error: 'Name is required' })
	.min(5, 'Name must be at least 5 characters long')
	.max(64, 'Name must be at most 64 characters long')
	.trim();

export const image = z.string({ required_error: 'Image URL is required' }).url('Invalid image URL');

export const email = z.string({ required_error: 'Email is required' }).email('Invalid email address').trim();

export const password = z
	.string({ required_error: 'Password is required' })
	.min(8, 'Password must be at least 8 characters long')
	.max(71, 'Password must be at most 71 characters long')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/\d/, 'Password must contain at least one number')
	.regex(/[\W_]/, 'Password must contain at least one special character');

export const registerSchema = z
	.object({
		name,
		email,
		password,
		confirmPassword: z.string({ required_error: 'Confirm password is required' })
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['password'] });
		}
	});

export const loginSchema = z.object({
	email,
	password: z.string({ required_error: 'Password is required' }),
	rememberMe: z.boolean().default(false)
});

export const forgotPasswordSchema = z.object({
	email
});

export const resetPasswordSchema = z
	.object({
		token: z.string({ required_error: 'Token is required' }),
		password,
		confirmPassword: z.string({ required_error: 'Confirm password is required' })
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['password'] });
		}
	});

export const betterAuthSchema = [
	{
		path: '/sign-up/email',
		adapter: StandardAdapter(
			z
				.object({
					name,
					email,
					password
				})
				.passthrough()
		)
	},
	{
		path: '/sign-in/email',
		adapter: StandardAdapter(
			z
				.object({
					email,
					password
				})
				.passthrough()
		)
	},
	{
		path: '/forget-password',
		adapter: StandardAdapter(z.object({ email }).passthrough())
	},
	{
		path: '/reset-password',
		adapter: StandardAdapter(z.object({ newPassword: password }).passthrough())
	},
	{
		path: '/send-verification-email',
		adapter: StandardAdapter(z.object({ email }).passthrough())
	},
	{
		path: '/change-email',
		adapter: StandardAdapter(z.object({ newEmail: email }).passthrough())
	},
	{
		path: '/change-password',
		adapter: StandardAdapter(z.object({ newPassword: password }).passthrough())
	},
	{
		path: '/update-user',
		adapter: StandardAdapter(z.object({ name: name.optional(), image: image.optional() }))
	}
];
