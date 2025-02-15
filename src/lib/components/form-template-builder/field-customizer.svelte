<script lang="ts">
	import type { FormTemplateField } from '@prisma/client'
	import { fieldLabels } from '@/config/form-builder'
	import { DeleteFieldAlertDialog } from '@/components/alert-dialogs'
	import { EditFieldDialog } from '@/components/dialogs'

	let { field }: { field: FormTemplateField } = $props()

	const fieldLabel = fieldLabels[field.type]
</script>

<div
	class="flex w-full items-center justify-between gap-4 rounded-md border border-muted bg-background p-4"
>
	<div class="flex items-center gap-2">
		<fieldLabel.Icon class="size-6 text-muted-foreground" />
		<span class="hidden text-muted-foreground md:block">{fieldLabel.label}:</span>
		{field.label}
	</div>
	<div class="flex gap-2">
		<EditFieldDialog {field} />
		<DeleteFieldAlertDialog {field} />
	</div>
</div>
