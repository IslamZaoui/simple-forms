<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import type { SidebarGroupItem } from '.';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		label: string;
		pages: SidebarGroupItem[];
		action?: Snippet;
		menu?: Snippet<[{ data: unknown }]>;
	}

	let { label, pages, action, menu }: Props = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupContent>
		<Sidebar.GroupLabel class="text-muted-foreground">{label}</Sidebar.GroupLabel>
		{@render action?.()}
		<Sidebar.Menu>
			{#each pages as { title, url, Icon, hasAction, data }}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton class={url === page.url.pathname ? 'text-primary/90 transition-colors' : ''}>
						{#snippet child({ props })}
							<a href={url} {...props}>
								{#if Icon}
									<Icon />
								{/if}
								<span>{title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
					{#if hasAction && menu}
						{@render menu({ data })}
					{/if}
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
