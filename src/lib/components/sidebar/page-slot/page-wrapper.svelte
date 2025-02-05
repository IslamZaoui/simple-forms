<script lang="ts">
	import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
	import type { Snippet } from 'svelte'
	import PageBreadcrumb, { type Link } from './page-breadcrumb.svelte'

	interface Props {
		children: Snippet
		links?: Link[]
	}

	let { children, links = undefined }: Props = $props()
</script>

<SidebarInset>
	<header class="flex h-16 shrink-0 items-center gap-2">
		<div class="flex items-center gap-2 px-4">
			<SidebarTrigger class="-ml-1" />
			{#if links}
				<PageBreadcrumb {links} />
			{/if}
		</div>
	</header>
	<div class="flex-1 p-4 pt-0">
		{@render children()}
	</div>
</SidebarInset>
