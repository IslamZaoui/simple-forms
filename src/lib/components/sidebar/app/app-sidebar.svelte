<script lang="ts">
	import { NavUser } from '../navs';
	import * as Sidebar from '@/components/ui/sidebar';
	import type { ComponentProps } from 'svelte';
	import { ReusableSidebarGroup } from '../sidebar-group';
	import { getUserFormTemplatesItems, userSpaceItems } from './groups';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import { FormTemplateDialog } from '@/components/dialogs';
	import type { FormTemplate } from '@prisma/client';
	import type { User } from 'better-auth';

	type Props = ComponentProps<typeof Sidebar.Root> & {
		user: User;
		latestTemplates: FormTemplate[];
	};

	const seeAll = {
		title: 'See all templates',
		url: '/app/form-templates'
	};

	let { ref = $bindable(null), user, latestTemplates, ...restProps }: Props = $props();
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
		<ReusableSidebarGroup label="Application" pages={userSpaceItems} />
		<ReusableSidebarGroup label="Form Templates" pages={[...getUserFormTemplatesItems(latestTemplates), seeAll]}>
			{#snippet action()}
				<FormTemplateDialog>
					{#snippet trigger({ props })}
						<Sidebar.GroupAction class="border border-muted bg-muted/50 p-2" {...props} title="Add Project">
							<PlusIcon /> <span class="sr-only">Add Form</span>
						</Sidebar.GroupAction>
					{/snippet}
				</FormTemplateDialog>
			{/snippet}
		</ReusableSidebarGroup>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
