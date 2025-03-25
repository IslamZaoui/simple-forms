import { FIELD_TYPE } from '@/constants/form-builder';
import { z } from 'zod';

const baseFieldSchema = z.object({
	label: z
		.string({ required_error: 'Label is required' })
		.min(1, 'Label must not be empty')
		.max(71, 'Label must not exceed 71 characters')
		.trim(),
	description: z.string().max(255, 'Description must not exceed 255 characters').trim().optional(),
	required: z.boolean({ required_error: 'Required is required' }).default(true),
	placeholder: z.string().max(120, 'Placeholder should not exceed 120 characters').trim().optional(),
	min: z.number().min(0, 'Minimum value cannot be less than 0').optional(),
	max: z.number().optional()
});

export const createFormTemplateFieldSchema = baseFieldSchema
	.extend({
		type: z.enum(FIELD_TYPE, { required_error: 'Field type is required' })
	})
	.superRefine(({ min, max }, ctx) => {
		if (min && max && min > max) {
			ctx.addIssue({
				code: 'custom',
				message: 'Minimum value must be less than or equal to maximum value',
				path: ['min']
			});
		}
		if (max && max >= Infinity) {
			ctx.addIssue({
				code: 'custom',
				message: 'Maximum value must be less than Infinity',
				path: ['max']
			});
		}
	});

export const updateFormTemplateFieldSchema = baseFieldSchema.superRefine(({ min, max }, ctx) => {
	if (min && max && min > max) {
		ctx.addIssue({
			code: 'custom',
			message: 'Minimum value must be less than or equal to maximum value',
			path: ['min']
		});
	}
	if (max && max >= Infinity) {
		ctx.addIssue({
			code: 'custom',
			message: 'Maximum value must be less than Infinity',
			path: ['max']
		});
	}
});

export const formTemplateSchema = z.object({
	title: z
		.string({ required_error: 'Title is required' })
		.min(5, 'Title must be at least 5 characters')
		.max(71, 'Title must not exceed 71 characters')
		.trim(),
	slug: z
		.string({ required_error: 'Slug is required' })
		.min(5, 'Slug must be at least 5 characters')
		.max(71, 'Slug must not exceed 71 characters')
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers and hyphens between words')
		.trim(),
	details: z.string().max(255, 'Details must not exceed 255 characters').optional()
});
