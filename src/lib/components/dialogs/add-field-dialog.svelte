<script lang="ts">
	import * as Dialog from '@/components/ui/dialog'
	import type { FormTemplateFieldType } from '@prisma/client'
	import { AddFormFieldForm } from '@/components/forms/form-template'
	import type { Snippet } from 'svelte'
	import { afterNavigate } from '$app/navigation'

	interface Props {
		type: FormTemplateFieldType
		templateId: string
		trigger: Snippet<[{ props: Record<string, unknown> }]>
	}

	let { type, trigger, templateId }: Props = $props()

	let open = $state(false)

	afterNavigate(() => (open = false))
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				Create {type.charAt(0).toLocaleUpperCase() + type.slice(1)} Field
			</Dialog.Title>
		</Dialog.Header>

		<AddFormFieldForm {templateId} {type} />
	</Dialog.Content>
</Dialog.Root>
