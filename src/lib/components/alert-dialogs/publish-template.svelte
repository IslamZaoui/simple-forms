<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import BookIcon from 'lucide-svelte/icons/book-check';
	import { Button } from '@/components/ui/button';
	import type { FormTemplate } from '@prisma/client';
	import { enhance } from '$app/forms';
	import { IsMobile } from '@/hooks/is-mobile.svelte';

	type Props = {
		template: FormTemplate;
	};

	let { template }: Props = $props();

	let isMobile = new IsMobile();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="bg-muted/50" variant="outline" size={isMobile.current ? 'icon' : 'default'}>
				<BookIcon class="size-4 {isMobile.current ? '' : 'mr-2'}" />
				{#if !isMobile.current}
					<span>Publish</span>
				{/if}
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Publishing {template.title}</AlertDialog.Title>
			<AlertDialog.Description>
				When the form is published, it will be available for users to fill out, and you will not able to edit it.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class="w-full">
				{#snippet child({ props })}
					<form action="?/publish" method="post" use:enhance>
						<Button type="submit" {...props}>Publish Template</Button>
					</form>
				{/snippet}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
