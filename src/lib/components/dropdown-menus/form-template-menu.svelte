<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { FormTemplate } from '@prisma/client';
	import TrashIcon from 'lucide-svelte/icons/trash';
	import { FormTemplateDialog } from '@/components/dialogs';
	import PenIcon from 'lucide-svelte/icons/pen';
	import { DeleteFormTemplateAlertDialog } from '@/components/alert-dialogs';
	import type { Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	type Props = {
		template: FormTemplate;
		trigger: Snippet<[{ props: Record<string, unknown> }]>;
	};

	let { template, trigger }: Props = $props();

	let open = $state(false);

	afterNavigate(() => (open = false));
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#if !template.published}
				<FormTemplateDialog data={template}>
					{#snippet trigger({ props })}
						<DropdownMenu.Item closeOnSelect={false} {...props}>
							<PenIcon class="mr-2 size-4" />
							<span>Edit</span>
						</DropdownMenu.Item>
					{/snippet}
				</FormTemplateDialog>
			{/if}

			<DeleteFormTemplateAlertDialog>
				{#snippet trigger({ props })}
					<DropdownMenu.Item closeOnSelect={false} {...props} class="bg-destructive text-destructive-foreground">
						<TrashIcon class="mr-2 size-4" />
						<span>Delete</span>
					</DropdownMenu.Item>
				{/snippet}
			</DeleteFormTemplateAlertDialog>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
