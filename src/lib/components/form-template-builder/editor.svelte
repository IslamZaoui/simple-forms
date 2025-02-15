<script lang="ts">
	import type { FormTemplateField } from '@prisma/client'
	import FieldCustomizer from './field-customizer.svelte'
	import { Button } from '@/components/ui/button'
	import PlusIcon from 'lucide-svelte/icons/plus'
	import { AddFieldDropdownMenu } from '@/components/dropdown-menus'

	type Props = {
		templateId: string
		fields: FormTemplateField[]
	}

	let { templateId, fields }: Props = $props()
</script>

<div class="flex size-full flex-1 flex-col gap-4 rounded-xl bg-muted/50 p-4">
	<h3 class="text-2xl font-bold">Form Fields Editor</h3>
	{#each fields as field (field.id)}
		<FieldCustomizer {field} />
	{:else}
		<div class="border border-muted rounded-md bg-background text-center p-5">
			There are no fields.
		</div>
	{/each}

	<AddFieldDropdownMenu {templateId}>
		{#snippet children({ props })}
			<Button size="sm" {...props}>
				<PlusIcon class="mr-2 size-4" />
				<span>Add Field</span>
			</Button>
		{/snippet}
	</AddFieldDropdownMenu>
</div>
