<script lang="ts">
	import EyeIcon from 'lucide-svelte/icons/eye';
	import EyeOffIcon from 'lucide-svelte/icons/eye-off';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';

	let {
		ref = $bindable(null),
		value = $bindable(),
		parentClass,
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> & {
		parentClass?: ClassValue | null | undefined;
	} = $props();

	let showPassword = $state(false);
	let disabled = $derived(value === '' || value === undefined || restProps.disabled);
	let type = $derived(showPassword ? 'text' : 'password');
</script>

<div class={['relative', parentClass]}>
	<Input {type} class={className} {...restProps} bind:ref bind:value />

	<Button
		type="button"
		variant="ghost"
		size="sm"
		class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
		onclick={() => (showPassword = !showPassword)}
		{disabled}
	>
		{#if showPassword && !disabled}
			<EyeIcon className="h-4 w-4" aria-hidden="true" />
		{:else}
			<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
		{/if}
		<span class="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
	</Button>
</div>
