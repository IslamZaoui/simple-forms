<script lang="ts">
	import { PageWrapper, type Link } from '@/components/sidebar/page-slot'
	import * as FormTemplateBuilder from '@/components/form-template-builder'
	import { IsMobile } from '@/hooks/is-mobile.svelte'
	import { FormTemplateDropdownMenu } from '@/components/dropdown-menus'
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle'
	import { Button } from '@/components/ui/button'
	import BookIcon from 'lucide-svelte/icons/book-check'

	let { data } = $props()

	const links: Link[] = [
		{
			label: 'My Form Templates',
			href: '/app/form-templates'
		},
		{
			label: data.template.title
		}
	]

	let isMobile = new IsMobile()
</script>

<PageWrapper {links}>
	<div class="flex h-full flex-col gap-4">
		<div
			class="flex max-h-[75px] w-full flex-1 items-center justify-between gap-4 rounded-xl bg-muted/50 p-4"
		>
			<h2 class="text-2xl font-bold">
				<span class="text-muted-foreground">{!data.template.published ? 'Draft: ' : ''}</span>
				{data.template.title}
			</h2>
			<div class="flex gap-2">
				{#if !data.template.published}
					<Button
						class="bg-muted/50"
						variant="outline"
						size={isMobile.current ? 'icon' : 'default'}
					>
						<BookIcon class="size-4 {isMobile.current ? '' : 'mr-2'}" />
						{#if !isMobile.current}
							<span>Publish</span>
						{/if}
					</Button>
				{/if}
				<FormTemplateDropdownMenu template={data.template} />
			</div>
		</div>
		{#await data.getFields}
			<div
				class="flex size-full flex-1 items-center justify-center gap-2 rounded-xl bg-muted/50 p-4"
			>
				<SpinnerIcon class="animate-spin" />
				<span>Loading form fields...</span>
			</div>
		{:then fields}
			{#if !isMobile.current}
				<div class="flex h-full gap-4">
					<FormTemplateBuilder.Editor templateId={data.template.id} {fields} />
					<FormTemplateBuilder.Preview template={data.template} {fields} />
				</div>
			{/if}
		{/await}
	</div>
</PageWrapper>
