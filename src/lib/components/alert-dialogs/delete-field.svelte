<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog'
	import TrashIcon from 'lucide-svelte/icons/trash'
	import { Button } from '@/components/ui/button'
	import type { FormTemplateField } from '@prisma/client'
	import { enhance } from '$app/forms'

	type Props = {
		field: FormTemplateField
	}

	let { field }: Props = $props()
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" variant="destructive">
				<TrashIcon class="size-4" />
				<span class="sr-only">delete</span>
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				Do you want to delete this <strong>field</strong>? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>
				{#snippet child({ props })}
					<form action="?/deleteField" method="post" use:enhance>
						<input type="hidden" name="fieldId" value={field.id} />
						<Button type="submit" {...props}>Delete Field</Button>
					</form>
				{/snippet}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
