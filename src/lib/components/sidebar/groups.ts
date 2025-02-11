import BlocksIcon from 'lucide-svelte/icons/blocks'
import LayoutDashoardIcon from 'lucide-svelte/icons/layout-dashboard'
import type { SidebarGroupItem } from './sidebar-group'

export const userSpaceItems: SidebarGroupItem[] = [
	{
		title: 'Dashboard',
		url: '/app/dashboard',
		Icon: LayoutDashoardIcon
	},
	{
		title: 'Form Builder',
		url: '/app/form-builder',
		Icon: BlocksIcon
	}
]
