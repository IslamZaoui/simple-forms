<script lang="ts">
	import { FormTemplateCard } from '@/components/cards';
	import { TemplatesSearchForm } from '@/components/forms/form-template';
	import type { Link } from '@/components/sidebar/page-slot';
	import PageWrapper from '@/components/sidebar/page-slot/page-wrapper.svelte';

	let { data } = $props();

	const links: Link[] = [
		{
			label: 'My Form Templates'
		}
	];
</script>

<PageWrapper {links}>
	<div class="flex h-full flex-col gap-4">
		<TemplatesSearchForm />

		{#if data.templates.length > 0}
			<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.templates as template}
					<FormTemplateCard {template} />
				{/each}
			</div>
		{:else}
			<p class="text-center text-muted-foreground">No forms available.</p>
		{/if}
	</div>
</PageWrapper>
