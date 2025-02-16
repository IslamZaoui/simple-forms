<script lang="ts">
	import type { FormTemplateField } from '@prisma/client';
	import FieldCustomizer from './field-customizer.svelte';
	import { Button } from '@/components/ui/button';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import { AddFieldDropdownMenu } from '@/components/dropdown-menus';
	import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit-svelte/core';
	import { dropAnimation, sensors } from '@/utils/dnd';
	import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';
	import { Droppable } from '../dnd';
	import { crossfade } from 'svelte/transition';
	import { invalidate } from '$app/navigation';

	type Props = {
		templateId: string;
		fields: FormTemplateField[];
	};

	let { templateId, fields }: Props = $props();

	let activeId = $state<string | null>();
	let activeItem = $derived(fields.find((field) => field.id === activeId));

	function onDragStart(event: DragStartEvent) {
		activeId = event.active.id as string;
	}

	const [send, recieve] = crossfade({ duration: 100 });

	function onDragEnd({ active, over }: DragEndEvent) {
		if (!over || over.id === active.id) {
			activeId = null;
			return;
		}

		const newIndex = fields.findIndex((field) => field.id === over.id);
		const oldIndex = fields.findIndex((field) => field.id === active.id);

		fields = arrayMove(fields, oldIndex, newIndex);
		saveOrder(fields);

		activeId = null;
	}

	async function saveOrder(fields: FormTemplateField[]) {
		const reorderedFields = fields.map((field, index) => ({
			id: field.id,
			order: index
		}));

		const response = await fetch(`/api/form-template/${templateId}/field/reorder`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fields: reorderedFields })
		});

		if (!response.ok) {
			console.error('Failed to reorder fields');
			return;
		}

		invalidate('app:fields');
	}
</script>

<div class="flex size-full flex-1 flex-col gap-4 rounded-md border border-muted bg-muted/50 p-4">
	{#if fields.length > 0}
		<DndContext {sensors} {onDragStart} {onDragEnd}>
			<SortableContext items={fields}>
				<Droppable id={templateId}>
					<div class="grid gap-2">
						{#each fields as field (field.id)}
							<div in:recieve={{ key: field.id }} out:send={{ key: field.id }}>
								<FieldCustomizer {field} />
							</div>
						{/each}
					</div>
				</Droppable>
			</SortableContext>

			<DragOverlay {dropAnimation}>
				{#if activeItem && activeId}
					<FieldCustomizer field={activeItem} />
				{/if}
			</DragOverlay>
		</DndContext>
	{:else}
		<div class="rounded-md border border-muted bg-background p-5 text-center">There are no fields.</div>
	{/if}

	<AddFieldDropdownMenu {templateId}>
		{#snippet children({ props })}
			<Button size="sm" {...props}>
				<PlusIcon class="mr-2 size-4" />
				<span>Add Field</span>
			</Button>
		{/snippet}
	</AddFieldDropdownMenu>
</div>
