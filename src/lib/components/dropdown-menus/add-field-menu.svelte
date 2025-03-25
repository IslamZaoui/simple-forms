<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Snippet } from 'svelte';
	import { AddFieldDialog } from '@/components/dialogs';
	import { afterNavigate } from '$app/navigation';
	import { fieldLabels } from '@/constants/form-builder';
	import { FormTemplateFieldType } from '@prisma/client';

	interface Props {
		templateId: string;
		children: Snippet<[{ props: Record<string, unknown> }]>;
	}

	let { children, templateId }: Props = $props();

	let open = $state(false);

	afterNavigate(() => (open = false));
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			{@render children({ props })}
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Fields</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each Object.entries(fieldLabels) as [type, { label, Icon }], i (i)}
				<AddFieldDialog {templateId} type={type as FormTemplateFieldType}>
					{#snippet trigger({ props })}
						<DropdownMenu.Item closeOnSelect={false} {...props}>
							<Icon class="mr-2 size-4" />
							<span>{label}</span>
						</DropdownMenu.Item>
					{/snippet}
				</AddFieldDialog>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
