<script lang="ts">
	import * as Settings from '@/components/forms/settings';
	import type { Link } from '@/components/sidebar/page-slot';
	import PageWrapper from '@/components/sidebar/page-slot/page-wrapper.svelte';
	import * as Tabs from '@/components/ui/tabs';

	let { data } = $props();

	const links: Link[] = [
		{
			label: 'Account settings'
		}
	];
</script>

<PageWrapper {links}>
	<Tabs.Root class="flex h-full flex-col gap-2" value={data.selectedTab}>
		<Tabs.List class="justify-start border border-muted bg-muted/50">
			<Tabs.Trigger value="general">General</Tabs.Trigger>
			<Tabs.Trigger value="security">Security</Tabs.Trigger>
			<Tabs.Trigger value="danger">Danger zone</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="space-y-4" value="general">
			<Settings.NameForm {data} />
			<Settings.EmailForm {data} />
		</Tabs.Content>

		<Tabs.Content class="space-y-4" value="security">
			<Settings.PasswordForm {data} />
		</Tabs.Content>

		<Tabs.Content class="space-y-4" value="danger">
			<Settings.DeleteAccountForm />
		</Tabs.Content>
	</Tabs.Root>
</PageWrapper>
