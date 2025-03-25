import { z } from 'zod';
import { email, image, name, password } from './auth';

export const changeImageSchema = z.object({
	image
});

export const changeNameSchema = z.object({
	name
});

export const changeEmailSchema = z.object({
	email
});

export const changePasswordSchema = z
	.object({
		currentPassword: z.string({ required_error: 'Current password is required' }),
		newPassword: password,
		confirmNewPassword: z.string({ required_error: 'Confirm password is required' }),
		logout: z.boolean().default(true)
	})
	.superRefine((data, ctx) => {
		if (data.newPassword !== data.confirmNewPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['newPassword']
			});
		}
	});
