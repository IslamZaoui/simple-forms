<script lang="ts">
	import NavUser from './nav-user.svelte'
	import * as Sidebar from '@/components/ui/sidebar'
	import type { ComponentProps } from 'svelte'

	type Props = ComponentProps<typeof Sidebar.Root> & {
		user: User
	}

	let { ref = $bindable(null), user, ...restProps }: Props = $props()
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a class="flex items-center gap-2 font-semibold" href="/app" {...props}>
							<img src="/favicon.png" alt="Simple Forms Logo" class="size-6" />
							<span>Simple Forms</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- Main navigation -->
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
