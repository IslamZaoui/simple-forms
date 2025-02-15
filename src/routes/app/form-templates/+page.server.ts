import { templateSearchSchema } from '@/schemas/template-search';
import { prisma } from '@/server/database';
import type { NonNullable } from '@/utils/types';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	event.depends('app:form-templates');
	const { user } = await event.parent();

	const searchParams = templateSearchSchema.safeParse(Object.fromEntries(event.url.searchParams));
	const { status, query } = searchParams.data as NonNullable<typeof searchParams.data>;

	const published = status === 'published' ? true : status === 'draft' ? false : undefined;
	const templates = await prisma.formTemplate.findMany({
		where: {
			userId: user.id,
			published,
			OR: query
				? [
						{
							title: { contains: query, mode: 'insensitive' }
						},
						{
							details: { contains: query, mode: 'insensitive' }
						}
					]
				: undefined
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		templates
	};
}) satisfies PageServerLoad;
