<script lang="ts">
	import { type Link, PageWrapper } from '@/components/sidebar/page-slot'

	let { data } = $props()

	const links: Link[] = [
		{
			label: 'App'
		}
	]
</script>

<PageWrapper {links}>
	<pre>{JSON.stringify(data, null, 4)}</pre>
</PageWrapper>
