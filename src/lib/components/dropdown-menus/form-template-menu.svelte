<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { FormTemplate } from '@prisma/client';
	import TrashIcon from 'lucide-svelte/icons/trash';
	import { Button } from '@/components/ui/button';
	import EllipsisIcon from 'lucide-svelte/icons/ellipsis-vertical';
	import { FormTemplateDialog } from '../dialogs';
	import PenIcon from 'lucide-svelte/icons/pen';
	import { DeleteFormTemplateAlertDialog } from '../alert-dialogs';

	let { template }: { template: FormTemplate } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="bg-muted/50" variant="outline" size="icon">
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<FormTemplateDialog data={template}>
				{#snippet trigger({ props })}
					<DropdownMenu.Item closeOnSelect={false} {...props}>
						<PenIcon class="mr-2 size-4" />
						<span>Edit</span>
					</DropdownMenu.Item>
				{/snippet}
			</FormTemplateDialog>

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
