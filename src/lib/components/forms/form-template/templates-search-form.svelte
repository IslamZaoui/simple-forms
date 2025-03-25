<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Select from '@/components/ui/select';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import SearchIcon from 'lucide-svelte/icons/search';
	import { Input } from '@/components/ui/input';
	import { Debounced } from 'runed';
	import { templateStatus, templateStatusLabels } from '.';

	let params = new SvelteURLSearchParams(page.url.searchParams);
	let query = $state(params.get('query') ?? '');

	const debounced = new Debounced(() => query, 350);

	$effect(() => {
		goto(`/app/form-templates?${params.toString()}`, {
			invalidate: ['app:form-templates']
		});
	});

	$effect(() => {
		params.set('query', debounced.current);
	});
</script>

<div class="flex items-center gap-2 rounded-md border border-muted bg-muted/50 p-4">
	<div class="flex items-center px-2">
		<SearchIcon class="mr-4 h-4 w-4 shrink-0 opacity-50" />
		<Input
			class="flex h-10 w-[350px] rounded-md py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
			type="search"
			placeholder="Search form templates..."
			bind:value={query}
			autofocus
		/>
	</div>

	<Select.Root type="single" onValueChange={(value) => params.set('status', value)}>
		<Select.Trigger class="w-[180px]">
			{templateStatusLabels[params.get('status') as templateStatus] ?? 'All Templates'}
		</Select.Trigger>
		<Select.Content>
			{#each Object.entries(templateStatusLabels) as [value, label], i (i)}
				<Select.Item {value}>
					{label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
