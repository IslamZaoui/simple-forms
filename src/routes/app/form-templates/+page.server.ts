import { prisma } from '@/server/database'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const { user } = await event.parent()

	const getTemplates = prisma.formTemplate.findMany({
		where: {
			userId: user.id
		}
	})

	return {
		getTemplates
	}
}) satisfies PageServerLoad
