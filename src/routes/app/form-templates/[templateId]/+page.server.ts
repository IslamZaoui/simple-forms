import { prisma } from '@/server/database';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.depends('app:template');
	const { user } = await event.parent();

	const { templateId } = event.params;
	const template = await prisma.formTemplate.findUnique({
		where: {
			id: templateId,
			userId: user.id
		}
	});
	if (!template) {
		return error(404, 'Template not found');
	}

	return {
		template,
		fields: await prisma.formTemplateField.findMany({
			where: {
				templateId
			},
			orderBy: {
				order: 'asc'
			}
		})
	};
};

export const actions: Actions = {
	publish: async (event) => {
		const session = event.locals.auth;
		if (!session) {
			return redirect(302, '/');
		}

		const { templateId } = event.params;
		const template = await prisma.formTemplate.findUnique({
			where: {
				id: templateId,
				userId: session.user.id
			}
		});
		if (!template) {
			return redirect(
				`/app/form-templates`,
				{
					type: 'error',
					message: 'Template not found'
				},
				event
			);
		}

		await prisma.formTemplate.update({
			data: {
				published: true
			},
			where: {
				id: templateId
			}
		});

		return redirect(
			{
				type: 'success',
				message: 'Template published successfully'
			},
			event
		);
	},

	hide: async (event) => {
		const session = event.locals.auth;
		if (!session) {
			return redirect(302, '/');
		}

		const { templateId } = event.params;
		const template = await prisma.formTemplate.findUnique({
			where: {
				id: templateId,
				userId: session.user.id
			}
		});
		if (!template) {
			return redirect(
				`/app/form-templates`,
				{
					type: 'error',
					message: 'Template not found'
				},
				event
			);
		}

		if (!template.published) {
			return error(400);
		}

		await prisma.formTemplate.update({
			data: {
				hidden: !template.hidden
			},
			where: {
				id: templateId
			}
		});

		return {};
	},

	deleteForm: async (event) => {
		const session = event.locals.auth;
		if (!session) {
			return redirect(302, '/');
		}

		const { templateId } = event.params;
		const template = await prisma.formTemplate.findUnique({
			where: {
				id: templateId,
				userId: session.user.id
			}
		});
		if (!template) {
			return redirect(
				`/app/form-templates`,
				{
					type: 'error',
					message: 'Template not found'
				},
				event
			);
		}

		await prisma.formTemplate.deleteMany({ where: { id: templateId } });

		return redirect(
			`/app/form-templates`,
			{
				type: 'success',
				message: 'Template deleted successfully'
			},
			event
		);
	},

	deleteField: async (event) => {
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
				`/app/form-templates`,
				{
					type: 'error',
					message: 'Template not found'
				},
				event
			);
		}

		if (template.published) {
			return redirect(
				{
					type: 'error',
					message: 'Template is published',
					description: 'You cannot delete a field from published template'
				},
				event
			);
		}

		const formData = await event.request.formData();
		const fieldId = formData.get('fieldId') as string | null;
		if (!fieldId) {
			return redirect(
				{
					type: 'error',
					message: 'Field not found'
				},
				event
			);
		}

		await prisma.formTemplateField.deleteMany({ where: { id: fieldId, templateId } });

		return redirect(
			{
				type: 'success',
				message: 'Field deleted successfully'
			},
			event
		);
	}
};
