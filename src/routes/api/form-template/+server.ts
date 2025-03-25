import { formTemplateSchema } from '@/schemas/form-template';
import { prisma } from '@/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import { actionResult, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = event.locals.auth;
	if (!session) {
		redirect(302, '/');
	}

	const form = await superValidate(event, zod(formTemplateSchema));
	if (!form.valid) {
		return actionResult('failure', { form });
	}

	const existingTemplate = await prisma.formTemplate.findUnique({
		where: {
			slug: form.data.slug
		},
		select: {
			id: true
		}
	});
	if (existingTemplate) {
		setError(form, 'slug', 'Template with this slug already exists');
		return actionResult('failure', { form });
	}

	const template = await prisma.formTemplate.create({
		data: {
			...form.data,
			userId: session.user.id
		},
		select: {
			id: true
		}
	});

	return actionResult('redirect', `/app/form-templates/${template.id}`, {
		message: {
			type: 'success',
			message: 'Form template created successfully'
		},
		cookieOptions: { sameSite: 'Lax' }
	});
};
