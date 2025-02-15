<script lang="ts">
	import type { FormTemplateField } from '@prisma/client';
	import * as Fields from './fields';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { FlashMessage } from '../providers';

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

{#if field.type === 'text' || field.type === 'email' || field.type === 'number'}
	<Fields.Text {field} {form} bind:fieldData />
{:else if field.type === 'textarea'}
	<Fields.Textarea {field} {form} bind:fieldData />
{/if}
