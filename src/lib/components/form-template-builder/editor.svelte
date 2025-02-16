<script lang="ts">
	import type { FormTemplateField } from '@prisma/client';
	import FieldCustomizer from './field-customizer.svelte';
	import { Button } from '@/components/ui/button';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import { AddFieldDropdownMenu } from '@/components/dropdown-menus';
	import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit-svelte/core';
	import { dropAnimation, sensors } from '@/utils/dnd';
	import { SortableContext } from '@dnd-kit-svelte/sortable';
	import { Droppable } from '../dnd';
	import { crossfade } from 'svelte/transition';
	import { enhance } from '$app/forms';

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

	let formEL = $state<HTMLFormElement | null>();
	let newIndex = $state(0);
	let oldIndex = $state(0);

	function onDragEnd({ active, over }: DragEndEvent) {
		if (!over) return;
		if (active.id === over.id) return;

		newIndex = fields.findIndex((field) => field.id === over.id);
		oldIndex = fields.findIndex((field) => field.id === active.id);

		formEL?.requestSubmit();
		activeId = null;
	}
</script>

<div class="flex size-full flex-1 flex-col gap-4 rounded-md border border-muted bg-muted/50 p-4">
	<h3 class="text-2xl font-bold">Form Fields Editor</h3>

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

	<form bind:this={formEL} use:enhance hidden action="?/reorderField" method="post">
		<input type="hidden" name="newIndex" value={newIndex} />
		<input type="hidden" name="oldIndex" value={oldIndex} />
	</form>
</div>
