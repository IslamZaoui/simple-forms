import { fieldReorderSchema } from '@/schemas/field';
import { prisma } from '@/server/database';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const session = event.locals.auth;
	if (!session) {
		return redirect(302, '/');
	}

	const { templateId } = event.params;
	const template = await prisma.formTemplate.findUnique({
		where: {
			id: templateId,
			userId: session.user.id
		},
		select: {
			id: true,
			published: true
		}
	});
	if (!template) {
		return redirect(
			'/app/form-templates',
			{
				type: 'error',
				message: 'Template not found'
			},
			event
		);
	}

	if (template.published) {
		return error(400);
	}

	const body = await event.request.json();
	const result = fieldReorderSchema.safeParse(body);
	if (!result.success) {
		return error(400);
	}

	const { fields } = result.data;

	const fieldIds = fields.map((f) => f.id);
	const existingFields = await prisma.formTemplateField.findMany({
		where: {
			id: { in: fieldIds },
			templateId
		}
	});

	if (fields.length !== existingFields.length) {
		return error(400);
	}

	await prisma.$transaction(
		fields.map(({ id, order }) =>
			prisma.formTemplateField.update({
				where: { id, templateId },
				data: { order }
			})
		)
	);

	return new Response();
};
