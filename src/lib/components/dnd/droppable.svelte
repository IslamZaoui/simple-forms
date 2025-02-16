<script lang="ts">
	import { useDroppable, type UseDroppableArguments } from '@dnd-kit-svelte/core';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface DroppableProps extends UseDroppableArguments {
		children: Snippet;
		class?: ClassValue;
	}

	let { children, class: className, ...rest }: DroppableProps = $props();

	const droppable = useDroppable(rest);
</script>

<div class={[className]} bind:this={droppable.node.current}>
	{@render children()}
</div>
