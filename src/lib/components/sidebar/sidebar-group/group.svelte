<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar'
	import type { SidebarGroupItem } from '.'

	interface Props {
		label: string
		items: SidebarGroupItem[]
	}

	let { label, items }: Props = $props()
</script>

<Sidebar.Group>
	<Sidebar.GroupContent>
		<Sidebar.GroupLabel class="text-muted-foreground">{label}</Sidebar.GroupLabel>
		<Sidebar.Menu>
			{#each items as { title, url, Icon } (url)}
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
