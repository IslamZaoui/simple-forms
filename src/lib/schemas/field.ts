import { z } from 'zod';

export const fieldReorderSchema = z.object({
	fields: z
		.array(
			z.object({
				id: z.string().min(1),
				order: z.number().int().nonnegative()
			})
		)
		.superRefine((fields, ctx) => {
			fields.forEach((field, index) => {
				if (field.order !== index) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: [index, 'order']
					});
				}
			});
		})
});
