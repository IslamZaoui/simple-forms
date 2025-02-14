<script lang="ts">
	import { formTemplateSchemaGenerator } from '@/utils/schema'
	import type { FormTemplateField } from '@prisma/client'
	import SuperDebug, { defaults, superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import MessageAlert from '@/components/forms/message-alert.svelte'
	import { Button } from '@/components/ui/form'
	import FieldSelector from './field-selector.svelte'
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle'

	type Props = {
		fields: FormTemplateField[]
	}

	let { fields }: Props = $props()

	const scheam = formTemplateSchemaGenerator(fields)

	const form = superForm(defaults(zod(scheam)), {
		SPA: true,
		dataType: 'json',
		validators: zod(scheam)
	})

	const { form: formData, enhance, delayed, message } = form
</script>

<form class="space-y-4" use:enhance method="post">
	<MessageAlert {message} />

	{#each fields as field (field.id)}
		<FieldSelector {form} {field} bind:fieldData={$formData[field.id]} />
	{/each}

	<Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		Submit
	</Button>

	<SuperDebug data={$formData} />
</form>
