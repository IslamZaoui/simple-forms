<script lang="ts">
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import LogOut from 'lucide-svelte/icons/log-out';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Sidebar from '@/components/ui/sidebar';
	import { useSidebar } from '@/components/ui/sidebar';
	import { BeamAvatar } from '@/components/ui/boring-avatars';
	import { goto } from '$app/navigation';
	import SettingsIcon from 'lucide-svelte/icons/settings';
	import type { User } from 'better-auth';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();

	const sidebar = useSidebar();
</script>

{#snippet UserInfo()}
	<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
		<BeamAvatar size={32} name={user.id} title={user.name || user.email} />
		<div class="grid flex-1 text-left text-sm leading-tight">
			{#if user.name}
				<span class="truncate font-semibold">{user.name}</span>
			{/if}
			<span class="truncate text-xs">{user.email}</span>
		</div>
	</div>
{/snippet}

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						{@render UserInfo()}
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					{@render UserInfo()}
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => goto('/app/settings')}>
					<SettingsIcon />
					Account settings
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => goto('/logout')}>
					<LogOut />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
