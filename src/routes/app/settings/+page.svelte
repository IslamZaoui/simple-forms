<script lang="ts">
	import { EmailForm, NameForm, PasswordForm } from '@/components/forms/settings'
	import type { Link } from '@/components/sidebar/page-slot'
	import PageWrapper from '@/components/sidebar/page-slot/page-wrapper.svelte'
	import * as Tabs from '@/components/ui/tabs'

	let { data } = $props()

	const links: Link[] = [
		{
			label: 'Account settings'
		}
	]
</script>

<PageWrapper {links}>
	<Tabs.Root class="flex h-full flex-col gap-2" value="general">
		<Tabs.List class="justify-start bg-muted/50">
			<Tabs.Trigger value="general">General</Tabs.Trigger>
			<Tabs.Trigger value="security">Security</Tabs.Trigger>
			<Tabs.Trigger value="authentication">Authentication</Tabs.Trigger>
			<Tabs.Trigger value="danger">Danger zone</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="space-y-4" value="general">
			<NameForm {data} />
			<EmailForm {data} />
		</Tabs.Content>

		<Tabs.Content class="space-y-4" value="security">
			<PasswordForm {data} />
		</Tabs.Content>

		<Tabs.Content class="space-y-4" value="authentication"></Tabs.Content>

		<Tabs.Content class="space-y-4" value="danger"></Tabs.Content>
	</Tabs.Root>
</PageWrapper>
