<script lang="ts">
	import type { FlashMessage } from '@/components/providers';
	import * as Alert from '@/components/ui/alert';
	import CircleCheckIcon from 'lucide-svelte/icons/circle-check';
	import CircleXIcon from 'lucide-svelte/icons/circle-x';
	import CircleAlertIcon from 'lucide-svelte/icons/circle-alert';
	import InfoIcon from 'lucide-svelte/icons/info';
	import type { Writable } from 'svelte/store';

	interface Props {
		message: Writable<FlashMessage | undefined>;
	}

	let { message }: Props = $props();
</script>

{#if $message}
	<Alert.Root>
		{#if $message.type === 'success'}
			<CircleCheckIcon class="size-4" />
		{:else if $message.type === 'error'}
			<CircleXIcon class="size-4" />
		{:else if $message.type === 'warning'}
			<CircleAlertIcon class="size-4" />
		{:else if $message.type === 'info'}
			<InfoIcon class="size-4" />
		{/if}
		<Alert.Title>{$message.message}</Alert.Title>
		{#if $message.description}
			<Alert.Description>{$message.description}</Alert.Description>
		{/if}
	</Alert.Root>
{/if}
