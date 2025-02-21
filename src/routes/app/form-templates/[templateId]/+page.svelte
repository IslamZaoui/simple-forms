<script lang="ts">
	import { PageWrapper, type Link } from '@/components/sidebar/page-slot';
	import { IsMobile } from '@/hooks/is-mobile.svelte';
	import { FormTemplateDropdownMenu } from '@/components/dropdown-menus';
	import { Button } from '@/components/ui/button';
	import * as Tabs from '@/components/ui/tabs';
	import EllipsisIcon from 'lucide-svelte/icons/ellipsis-vertical';
	import { Editor, Preview } from '@/components/form-template-builder';
	import { PublishTemplateAlertDialog } from '@/components/alert-dialogs/index.js';

	let { data } = $props();

	const links: Link[] = [
		{
			label: 'My Form Templates',
			href: '/app/form-templates'
		},
		{
			label: data.template.title
		}
	];

	let isMobile = new IsMobile();
</script>

<PageWrapper {links}>
	<div class="flex h-full flex-col gap-4">
		<div
			class="flex max-h-[75px] w-full flex-1 items-center justify-between gap-4 rounded-md border border-muted bg-muted/50 p-4"
		>
			<h2 class="text-2xl font-bold">
				<span class="text-muted-foreground">{!data.template.published ? 'Draft: ' : ''}</span>
				{data.template.title}
			</h2>
			<div class="flex gap-2">
				{#if !data.template.published}
					<PublishTemplateAlertDialog template={data.template} />
				{/if}
				<FormTemplateDropdownMenu template={data.template}>
					{#snippet trigger({ props })}
						<Button {...props} class="bg-muted/50" variant="outline" size="icon">
							<EllipsisIcon />
						</Button>
					{/snippet}
				</FormTemplateDropdownMenu>
			</div>
		</div>
		{#if !isMobile.current}
			<div class="flex h-full gap-4">
				{#if !data.template.published}
					<Editor templateId={data.template.id} fields={data.fields} />
				{/if}
				<Preview template={data.template} fields={data.fields} />
			</div>
		{:else}
			<Tabs.Root class="flex flex-1 flex-col" value="editor">
				<Tabs.List class="w-full border border-muted bg-muted/50">
					<Tabs.Trigger class="w-full" value="editor">Editor</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="preview">Preview</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content class="flex-1" value="editor">
					<Editor templateId={data.template.id} fields={data.fields} />
				</Tabs.Content>
				<Tabs.Content class="flex-1" value="preview">
					<Preview template={data.template} fields={data.fields} />
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</div>
</PageWrapper>
