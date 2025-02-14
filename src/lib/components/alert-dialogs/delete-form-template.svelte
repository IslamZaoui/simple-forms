<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog'
	import { Button } from '@/components/ui/button'
	import { enhance } from '$app/forms'
	import type { Snippet } from 'svelte'

	interface Props {
		trigger: Snippet<[{ props: Record<string, unknown> }]>
	}

	let { trigger }: Props = $props()
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				Do you want to delete this <strong>form template</strong>? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>
				{#snippet child({ props })}
					<form action="?/deleteForm" method="post" use:enhance>
						<Button type="submit" {...props}>Delete Form Template</Button>
					</form>
				{/snippet}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
