<script lang="ts">
	import { AppSidebar } from '@/components/sidebar'
	import * as Sidebar from '@/components/ui/sidebar'

	let { data, children } = $props()
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} />
	{@render children()}
</Sidebar.Provider>
