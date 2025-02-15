<script lang="ts">
	import { updateFormTemplateFieldSchema } from '@/schemas/form-template';
	import * as Form from '@/components/ui/form';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Separator } from '@/components/ui/separator';
	import { Input } from '@/components/ui/input';
	import type { FormTemplateField } from '@prisma/client';
	import MessageAlert from '../message-alert.svelte';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import { Checkbox } from '@/components/ui/checkbox';

	type Props = {
		field: FormTemplateField;
	};

	let { field }: Props = $props();

	const form = superForm(
		defaults(zod(updateFormTemplateFieldSchema), {
			defaults: {
				label: field.label,
				description: field.description || undefined,
				placeholder: field.placeholder || undefined,
				required: field.required,
				min: field.min || undefined,
				max: field.max || undefined
			}
		}),
		{
			validators: zod(updateFormTemplateFieldSchema)
		}
	);

	let { form: formData, enhance, delayed, message } = form;
</script>

<form class="space-y-2 py-4" action="/api/form-template/{field.templateId}/field/{field.id}" use:enhance method="post">
	<MessageAlert {message} />

	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<Separator />
		</div>
		<div class="relative flex justify-center text-sm">
			<span class="bg-background px-2 text-muted-foreground">Field details</span>
		</div>
	</div>

	<Form.Field {form} name="label">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Label <span class="text-destructive">*</span></Form.Label>
				<Input type="text" placeholder="label..." {...props} bind:value={$formData.label} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Input type="text" placeholder="description..." {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="required" class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox {...props} bind:checked={$formData.required} />
				<div class="leading-none">
					<Form.Label>Required?</Form.Label>
				</div>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<Separator />
		</div>
		<div class="relative flex justify-center text-sm">
			<span class="bg-background px-2 text-muted-foreground">Field options</span>
		</div>
	</div>

	{#if ['text', 'textarea', 'email', 'number'].includes(field.type)}
		<Form.Field {form} name="placeholder">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Placeholder</Form.Label>
					<Input type="text" placeholder="placeholder..." {...props} bind:value={$formData.placeholder} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	{#if ['text', 'textarea', 'number'].includes(field.type)}
		<div class="flex w-full gap-4">
			<Form.Field class="w-full" {form} name="min">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Min {field.type === 'number' ? 'value' : 'length'}</Form.Label>
						<Input type="number" placeholder="min..." {...props} bind:value={$formData.min} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field class="w-full" {form} name="max">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Max {field.type === 'number' ? 'value' : 'length'}</Form.Label>
						<Input type="number" placeholder="max..." {...props} bind:value={$formData.max} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	{/if}

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>Save</span>
	</Form.Button>
</form>
