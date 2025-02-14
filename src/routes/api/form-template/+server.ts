import { REDIRECT_GUEST_URL } from '@/config/auth'
import { formTemplateSchema } from '@/schemas/form-template'
import { prisma } from '@/server/database'
import { createRateLimiter } from '@/server/rate-limiter'
import { redirect } from 'sveltekit-flash-message/server'
import { actionResult, setError, setMessage, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { RequestHandler } from './$types'

const limiter = createRateLimiter({
	prefix: 'create-form-template',
	rates: {
		IP: [5, 'm'],
		IPUA: [3, 'm']
	}
})

export const POST: RequestHandler = async (event) => {
	const session = event.locals.auth()
	if (!session) {
		redirect(302, REDIRECT_GUEST_URL)
	}

	const form = await superValidate(event, zod(formTemplateSchema))
	if (!form.valid) {
		return actionResult('failure', { form })
	}

	const status = await limiter.check(event)
	if (status.limited) {
		setMessage(form, {
			type: 'error',
			message: 'Too many requests',
			description: `Try again in ${status.retryAfter}s`
		})
		return actionResult('failure', {
			form
		})
	}

	const existingTemplate = await prisma.formTemplate.findUnique({
		where: {
			slug: form.data.slug
		},
		select: {
			id: true
		}
	})
	if (existingTemplate) {
		setError(form, 'slug', 'Template with this slug already exists')
		return actionResult('failure', { form })
	}

	const template = await prisma.formTemplate.create({
		data: {
			...form.data,
			userId: session.userId
		},
		select: {
			id: true
		}
	})

	return actionResult('redirect', `/app/form-templates/${template.id}`, {
		message: {
			type: 'success',
			message: 'Form template created successfully'
		},
		cookieOptions: { sameSite: 'Lax' }
	})
}
