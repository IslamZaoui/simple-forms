<script lang="ts">
	import type { FormTemplateField } from '@prisma/client';
	import { fieldLabels } from '@/config/form-builder';
	import { DeleteFieldAlertDialog } from '@/components/alert-dialogs';
	import { EditFieldDialog } from '@/components/dialogs';
	import { CSS, styleObjectToString } from '@dnd-kit-svelte/utilities';
	import { useSortable } from '@dnd-kit-svelte/sortable';
	import DragIcon from 'lucide-svelte/icons/grip-vertical';

	let { field }: { field: FormTemplateField } = $props();
	const fieldLabel = fieldLabels[field.type];

	const { attributes, listeners, activatorNode, node, transform, transition, isDragging, isSorting, isOver } =
		useSortable({
			id: field.id
		});

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined
		})
	);
</script>

<div class="relative" bind:this={node.current} {style}>
	<div
		class={[
			'flex h-[75px] w-full items-center justify-between gap-4 rounded-md border border-muted bg-background p-4',
			{ invisible: isDragging.current, 'bg-muted/70': isOver.current }
		]}
	>
		<div class="flex items-center gap-2">
			<div bind:this={activatorNode.current} {...listeners.current} {...attributes.current}>
				<DragIcon />
			</div>
			<fieldLabel.Icon class="size-6 text-muted-foreground" />
			<span class="hidden text-muted-foreground md:block">{fieldLabel.label}:</span>
			{field.label}
		</div>
		<div class="flex gap-2">
			<EditFieldDialog {field} />
			<DeleteFieldAlertDialog {field} />
		</div>
	</div>

	{#if isDragging.current}
		<div
			class="absolute inset-0 flex h-[75px] w-full items-center gap-2 rounded-md border border-dashed border-primary bg-background/50 p-4"
		>
			<DragIcon />
			<span class="hidden text-muted-foreground md:block">Dragging {fieldLabel.label}:</span>
			<span>{field.label}</span>
		</div>
	{/if}
</div>
