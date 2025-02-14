<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar'
	import type { SidebarGroupItem } from '.'
	import type { Snippet } from 'svelte'

	interface Props {
		label: string
		pages: SidebarGroupItem[]
		action?: Snippet
	}

	let { label, pages, action }: Props = $props()
</script>

<Sidebar.Group>
	<Sidebar.GroupContent>
		<Sidebar.GroupLabel class="text-muted-foreground">{label}</Sidebar.GroupLabel>
		{@render action?.()}
		<Sidebar.Menu>
			{#each pages as { title, url, Icon } (url)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={url} {...props}>
								{#if Icon}
									<Icon />
								{/if}
								<span>{title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
