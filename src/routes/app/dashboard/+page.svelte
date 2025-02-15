<script lang="ts">
	import { type Link, PageWrapper } from '@/components/sidebar/page-slot';

	let { data } = $props();

	const links: Link[] = [
		{
			label: 'App'
		}
	];
</script>

<PageWrapper {links}>
	<div class="size-full rounded-md bg-muted/50 p-4">
		<pre class="text-wrap">{JSON.stringify(data, null, 4)}</pre>
	</div>
</PageWrapper>
