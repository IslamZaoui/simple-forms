<script lang="ts">
	import type { Link } from '@/components/sidebar/page-slot'
	import PageWrapper from '@/components/sidebar/page-slot/page-wrapper.svelte'

	let { data } = $props()

	const links: Link[] = [
		{
			label: 'My Form Templates'
		}
	]
</script>

<PageWrapper {links}>
	<div class="h-full rounded-md bg-muted/50 p-4">
		{#await data.getTemplates then templates}
			<li class="ml-4">
				{#each templates as template (template.id)}
					<lo>
						<a class="hover:underline" href="/app/form-templates/{template.id}">
							{template.title}
						</a>
					</lo>
				{/each}
			</li>
		{/await}
	</div>
</PageWrapper>
