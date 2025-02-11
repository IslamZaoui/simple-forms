<script lang="ts">
	import type { Link } from '@/components/sidebar/index.js'
	import { PageWrapper } from '@/components/sidebar'

	let { data } = $props()

	const links: Link[] = [
		{
			label: 'Form Builder'
		}
	]
</script>

<PageWrapper {links}>
	<div></div>
</PageWrapper>
