export type SidebarGroupItem = {
	title: string
	url: string
	Icon?: ConstructorOfATypedSvelteComponent
	hasAction?: boolean
}

export { default as ReusableSidebarGroup } from './group.svelte'
