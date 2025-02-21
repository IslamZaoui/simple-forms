import { REDIRECT_GUEST_URL } from '@/config/auth';
import { createFormTemplateFieldSchema } from '@/schemas/form-template';
import { prisma } from '@/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import { actionResult, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = event.locals.auth();
	if (!session) {
		redirect(302, REDIRECT_GUEST_URL);
	}

	const form = await superValidate(event, zod(createFormTemplateFieldSchema));
	if (!form.valid) {
		return actionResult('failure', { form });
	}

	const { templateId } = event.params;
	const existingTemplate = await prisma.formTemplate.findUnique({
		where: {
			id: templateId,
			userId: session.userId
		},
		select: {
			id: true,
			published: true
		}
	});
	if (!existingTemplate) {
		setMessage(form, {
			type: 'error',
			message: 'Template not found'
		});
		return actionResult('failure', { form });
	}

	if (existingTemplate.published) {
		setMessage(form, {
			type: 'error',
			message: 'Published templates cannot be edited'
		});
		return actionResult('failure', { form });
	}

	const fieldCount = await prisma.formTemplateField.count({
		where: {
			templateId
		}
	});

	await prisma.formTemplateField.create({
		data: {
			...form.data,
			templateId,
			order: fieldCount
		}
	});

	return actionResult('redirect', `/app/form-templates/${templateId}`, {
		message: {
			type: 'success',
			message: 'Field added successfully'
		},
		cookieOptions: {
			sameSite: 'Lax'
		}
	});
};
