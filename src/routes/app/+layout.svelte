<script lang="ts">
	import { AppSidebar } from '@/components/sidebar/app';
	import { SidebarProvider } from '@/components/ui/sidebar';

	let { data, children } = $props();
</script>

<SidebarProvider>
	<AppSidebar user={data.user} latestTemplates={data.latestTemplates} />
	{@render children()}
</SidebarProvider>
