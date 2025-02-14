import { REDIRECT_GUEST_URL } from '@/config/auth'
import { prisma } from '@/server/database'
import { createRateLimiter } from '@/server/rate-limiter'
import { error } from '@sveltejs/kit'
import { redirect } from 'sveltekit-flash-message/server'
import type { Actions, PageServerLoad } from './$types'

const formLimiter = createRateLimiter({
	prefix: 'delete-form-template',
	rates: {
		IP: [20, 'm'],
		IPUA: [10, 'm']
	}
})

const fieldLimiter = createRateLimiter({
	prefix: 'delete-field-template',
	rates: {
		IP: [20, 'm'],
		IPUA: [10, 'm']
	}
})

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent()

	const { templateId } = event.params
	const template = await prisma.formTemplate.findUnique({
		where: {
			id: templateId,
			userId: user.id
		}
	})
	if (!template) {
		return error(404, 'Template not found')
	}

	const getFields = prisma.formTemplateField.findMany({
		where: {
			templateId
		},
		orderBy: {
			order: 'asc'
		}
	})

	return {
		template,
		getFields
	}
}

export const actions: Actions = {
	deleteForm: async (event) => {
		const session = event.locals.auth()
		if (!session) {
			return redirect(302, REDIRECT_GUEST_URL)
		}

		const { templateId } = event.params

		const status = await formLimiter.check(event)
		if (status.limited) {
			return redirect(
				`/app/form-templates/${templateId}`,
				{
					type: 'error',
					message: 'Too many requests',
					description: `Try again in ${status.retryAfter}s`
				},
				event
			)
		}

		const template = await prisma.formTemplate.findUnique({
			where: {
				id: templateId,
				userId: session.userId
			}
		})
		if (!template) {
			return redirect(
				`/app/form-templates`,
				{
					type: 'error',
					message: 'Template not found'
				},
				event
			)
		}

		await prisma.formTemplate.deleteMany({ where: { id: templateId } })

		return redirect(
			`/app/form-templates`,
			{
				type: 'success',
				message: 'Template deleted successfully'
			},
			event
		)
	},

	deleteField: async (event) => {
		const session = event.locals.auth()
		if (!session) {
			return redirect(302, REDIRECT_GUEST_URL)
		}

		const { templateId } = event.params

		const status = await fieldLimiter.check(event)
		if (status.limited) {
			return redirect(
				`/app/form-templates/${templateId}`,
				{
					type: 'error',
					message: 'Too many requests',
					description: `Try again in ${status.retryAfter}s`
				},
				event
			)
		}

		const template = await prisma.formTemplate.findUnique({
			where: {
				id: templateId,
				userId: session.userId
			},
			select: {
				id: true,
				published: true
			}
		})
		if (!template) {
			return redirect(
				`/app/form-templates`,
				{
					type: 'error',
					message: 'Template not found'
				},
				event
			)
		}

		if (template.published) {
			return redirect(
				`/app/form-templates/${templateId}`,
				{
					type: 'error',
					message: 'Template is published',
					description: 'You cannot delete a field from published template'
				},
				event
			)
		}

		const formData = await event.request.formData()
		const fieldId = formData.get('fieldId') as string | null
		if (!fieldId) {
			return redirect(
				`/app/form-templates/${templateId}`,
				{
					type: 'error',
					message: 'Field not found'
				},
				event
			)
		}

		await prisma.formTemplateField.deleteMany({ where: { id: fieldId, templateId } })

		return redirect(
			`/app/form-templates/${templateId}`,
			{
				type: 'success',
				message: 'Field deleted successfully'
			},
			event
		)
	}
}
