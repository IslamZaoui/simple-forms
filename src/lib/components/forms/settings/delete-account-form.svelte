<script lang="ts">
	import { Separator } from '@/components/ui/separator'
	import { enhance } from '$app/forms'
	import { Button, buttonVariants } from '@/components/ui/button'
	import * as AlertDialog from '@/components/ui/alert-dialog'
</script>

<div class="flex flex-col rounded-md border border-destructive bg-muted/50">
	<div class="space-y-2 p-4">
		<h2 class="text-2xl font-bold">Delete Account</h2>
		<p>
			Permanently remove your Personal Account and all of its contents from simple forms. This
			action is not reversible, so please continue with caution.
		</p>
	</div>
	<Separator class="bg-destructive" />
	<div class="flex items-center justify-end bg-destructive/25 px-4 py-2">
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="destructive">
						<span>Delete Account</span>
					</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content class="border-destructive">
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action class={buttonVariants({ variant: 'destructive' })}>
						{#snippet child({ props })}
							<form action="?/deleteAccount" method="POST" use:enhance>
								<Button {...props} type="submit">Confirm</Button>
							</form>
						{/snippet}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</div>
