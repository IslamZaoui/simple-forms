<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import type { FormTemplateField } from '@prisma/client';
	import { EditFormFieldForm } from '@/components/forms/form-template';
	import { afterNavigate } from '$app/navigation';
	import PenIcon from 'lucide-svelte/icons/pen';
	import { Button } from '@/components/ui/button';

	interface Props {
		field: FormTemplateField;
	}

	let { field }: Props = $props();

	let open = $state(false);

	afterNavigate(() => (open = false));
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button class="bg-muted/50" variant="outline" size="icon" {...props}>
				<PenIcon />
				<span class="sr-only">Edit Field</span>
			</Button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				Edit {field.label} Field
			</Dialog.Title>
		</Dialog.Header>

		<EditFormFieldForm {field} />
	</Dialog.Content>
</Dialog.Root>
