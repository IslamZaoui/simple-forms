import LayoutDashoardIcon from 'lucide-svelte/icons/layout-dashboard'
import type { SidebarGroupItem } from '../sidebar-group'

export const userSpaceItems: SidebarGroupItem[] = [
	{
		title: 'Dashboard',
		url: '/app/dashboard',
		Icon: LayoutDashoardIcon
	}
]
