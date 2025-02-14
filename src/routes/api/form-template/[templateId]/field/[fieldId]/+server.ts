import { REDIRECT_GUEST_URL } from '@/config/auth'
import { updateFormTemplateFieldSchema } from '@/schemas/form-template'
import { prisma } from '@/server/database'
import { createRateLimiter } from '@/server/rate-limiter'
import { actionResult, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { RequestHandler } from './$types'

const limiter = createRateLimiter({
	prefix: 'update-form-template-field',
	rates: {
		IP: [30, 'm'],
		IPUA: [15, 'm']
	}
})

export const POST: RequestHandler = async (event) => {
	const session = event.locals.auth()
	if (!session) {
		return actionResult('redirect', REDIRECT_GUEST_URL)
	}

	const status = await limiter.check(event)
	if (status.limited) {
		return actionResult('failure', {
			message: {
				type: 'error',
				message: 'Too many requests',
				description: `Try again in ${status.retryAfter}s`
			}
		})
	}

	const { templateId, fieldId } = event.params
	const template = await prisma.formTemplate.findUnique({
		where: {
			id: templateId,
			userId: session.userId
		},
		select: {
			id: true
		}
	})
	if (!template) {
		return actionResult('redirect', '/app/form-templates', {
			message: {
				type: 'error',
				message: 'Template not found'
			},
			cookieOptions: {
				sameSite: 'Lax'
			}
		})
	}

	const field = await prisma.formTemplateField.findUnique({
		where: {
			id: fieldId
		},
		select: {
			id: true
		}
	})
	if (!field) {
		return actionResult('redirect', `/app/form-templates/${templateId}`, {
			message: {
				type: 'error',
				message: 'Field not found'
			},
			cookieOptions: {
				sameSite: 'Lax'
			}
		})
	}

	const form = await superValidate(event, zod(updateFormTemplateFieldSchema))
	if (!form.valid) {
		return actionResult('failure', { form })
	}

	await prisma.formTemplateField.update({
		where: {
			id: fieldId
		},
		data: form.data
	})

	return actionResult('redirect', `/app/form-templates/${templateId}`, {
		message: {
			type: 'success',
			message: 'Field updated successfully'
		},
		cookieOptions: {
			sameSite: 'Lax'
		}
	})
}
