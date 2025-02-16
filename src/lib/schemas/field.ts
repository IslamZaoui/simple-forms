import { z } from 'zod';

export const reorderFieldSchema = z
	.object({
		newIndex: z.coerce.number().min(0),
		oldIndex: z.coerce.number().min(0)
	})
	.superRefine(({ newIndex, oldIndex }, ctx) => {
		if (newIndex === oldIndex) {
			ctx.addIssue({
				code: 'custom'
			});
		}
	});
