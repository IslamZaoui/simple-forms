import { templateStatus } from '@/components/forms/form-template';
import { z } from 'zod';

export const templateSearchSchema = z.object({
	query: z.string().trim().nullable().optional(),
	status: z.enum(templateStatus).default('all')
});
