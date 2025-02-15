<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { CreateUpdateFormTemplateForm } from '@/components/forms/form-template';
	import type { FormTemplate } from '@prisma/client';
	import type { Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	interface Props {
		data?: FormTemplate;
		trigger: Snippet<[{ props: Record<string, unknown> }]>;
	}

	let { data, trigger }: Props = $props();

	let open = $state(false);

	afterNavigate(() => (open = false));
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{!data ? 'Create new' : 'Update'} Form Template</Dialog.Title>
		</Dialog.Header>

		<CreateUpdateFormTemplateForm {data} />
	</Dialog.Content>
</Dialog.Root>
