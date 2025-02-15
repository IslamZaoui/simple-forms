export type SidebarGroupItem = {
	title: string;
	url: string;
	Icon?: ConstructorOfATypedSvelteComponent;
	hasAction?: boolean;
	data?: unknown;
};

export { default as ReusableSidebarGroup } from './group.svelte';
