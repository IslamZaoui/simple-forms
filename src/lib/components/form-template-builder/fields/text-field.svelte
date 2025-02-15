<script lang="ts">
	import { Input } from '@/components/ui/input';
	import type { FormTemplateField } from '@prisma/client';
	import * as Form from '@/components/ui/form';
	import type { FlashMessage } from '@/components/providers';
	import type { SuperForm } from 'sveltekit-superforms';

	interface Props {
		form: SuperForm<
			{
				[x: string]: any;
			},
			FlashMessage
		>;
		fieldData: unknown;
		field: FormTemplateField;
	}

	let { field, form, fieldData = $bindable() }: Props = $props();
</script>

<Form.Field {form} name={field.id}>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>
				{field.label}
				{#if field.required}
					<span class="text-destructive">*</span>
				{/if}
			</Form.Label>
			<Input type={field.type} placeholder={field.placeholder} {...props} bind:value={fieldData} />
		{/snippet}
	</Form.Control>
	{#if field.description}
		<Form.Description>{field.description}</Form.Description>
	{/if}
	<Form.FieldErrors />
</Form.Field>
