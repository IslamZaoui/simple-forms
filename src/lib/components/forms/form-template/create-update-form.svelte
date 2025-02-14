<script lang="ts">
	import { formTemplateSchema } from '@/schemas/form-template'
	import { defaults, superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import MessageAlert from '../message-alert.svelte'
	import * as Form from '@/components/ui/form'
	import { Input } from '@/components/ui/input'
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle'
	import { Textarea } from '@/components/ui/textarea'
	import type { FormTemplate } from '@prisma/client'

	interface Props {
		data?: FormTemplate
	}

	let { data }: Props = $props()

	const defaultForm = defaults(zod(formTemplateSchema), {
		defaults: {
			title: data?.title ?? '',
			slug: data?.slug ?? '',
			details: data?.details ?? undefined
		}
	})

	const form = superForm(defaultForm, {
		validators: zod(formTemplateSchema)
	})

	const { form: formData, enhance, delayed, message } = form

	const url = !data ? '/api/form-template' : `/api/form-template/${data.id}`
</script>

<form class="mx-auto w-full max-w-md space-y-5 py-1" method="POST" action={url} use:enhance>
	<MessageAlert {message} />

	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Form Title <span class="text-destructive">*</span></Form.Label>
				<Input type="text" placeholder="title..." {...props} bind:value={$formData.title} />
			{/snippet}
		</Form.Control>
		<Form.Description>This is the title of the form</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="slug">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Form Slug <span class="text-destructive">*</span></Form.Label>
				<Input type="text" placeholder="slug..." {...props} bind:value={$formData.slug} />
			{/snippet}
		</Form.Control>
		<Form.Description>This is a unique identifier for your form</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="details">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Form Details</Form.Label>
				<Textarea rows={2} placeholder="details..." {...props} bind:value={$formData.details} />
			{/snippet}
		</Form.Control>
		<Form.Description>This is a description of this form purpose</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>{data?.id ? 'Save' : 'Create new form template'}</span>
	</Form.Button>
</form>
