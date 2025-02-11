<script lang="ts">
	import { PageWrapper, type Link } from '@/components/sidebar'

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
