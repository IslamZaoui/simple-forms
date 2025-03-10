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
	let tempId = $state(templateId);
	let tempFields = $state(fields);

	$effect(() => {
		tempId = templateId;
		tempFields = fields;
	});

	let activeId = $state<string | null>();
	let activeItem = $derived(tempFields.find((field) => field.id === activeId));

	function onDragStart(event: DragStartEvent) {
		activeId = event.active.id as string;
	}

	const [send, recieve] = crossfade({ duration: 100 });

	function onDragEnd({ active, over }: DragEndEvent) {
		if (!over || over.id === active.id) {
			activeId = null;
			return;
		}

		const newIndex = tempFields.findIndex((field) => field.id === over.id);
		const oldIndex = tempFields.findIndex((field) => field.id === active.id);

		tempFields = arrayMove(tempFields, oldIndex, newIndex);
		saveOrder(tempFields);

		activeId = null;
	}

	async function saveOrder(fields: FormTemplateField[]) {
		const reorderedFields = fields.map((field, index) => ({
			id: field.id,
			order: index
		}));

		const { ok } = await fetch(`/api/form-template/${templateId}/field/reorder`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fields: reorderedFields })
		});

		if (!ok) {
			console.error('Failed to reorder fields');
			return;
		}

		invalidate('app:template');
	}
</script>

<div class="flex size-full flex-1 flex-col gap-4 rounded-md border border-muted bg-muted/50 p-4">
	{#if tempFields.length > 0}
		<DndContext {sensors} {onDragStart} {onDragEnd}>
			<SortableContext items={tempFields}>
				<Droppable id={tempId}>
					<div class="grid gap-2">
						{#each tempFields as field (field.id)}
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
