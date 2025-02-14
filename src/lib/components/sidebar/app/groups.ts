import type { FormTemplate } from '@prisma/client'
import LayoutDashoardIcon from 'lucide-svelte/icons/layout-dashboard'
import type { SidebarGroupItem } from '../sidebar-group'

export const userSpaceItems: SidebarGroupItem[] = [
	{
		title: 'Dashboard',
		url: '/app/dashboard',
		Icon: LayoutDashoardIcon
	}
]

export const getUserFormTemplatesItems = (templates: FormTemplate[]) => {
	const items: SidebarGroupItem[] = []
	for (const template of templates) {
		items.push({
			title: template.title,
			url: `/app/form-templates/${template.id}`,
			hasAction: true
		})
	}

	return items
}
