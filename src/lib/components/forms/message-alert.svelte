<script lang="ts">
	import type { Flash } from '@/components/providers';
	import * as Alert from '@/components/ui/alert';
	import CircleCheckIcon from 'lucide-svelte/icons/circle-check';
	import CircleXIcon from 'lucide-svelte/icons/circle-x';
	import CircleAlertIcon from 'lucide-svelte/icons/circle-alert';
	import InfoIcon from 'lucide-svelte/icons/info';
	import type { Writable } from 'svelte/store';

	interface Props {
		message: Writable<Flash | undefined>;
	}

	let { message }: Props = $props();

	const ICONS = {
		success: CircleCheckIcon,
		error: CircleXIcon,
		warning: CircleAlertIcon,
		info: InfoIcon
	};

	const COLORS = {
		success: 'border-green-500 [&>svg]:text-green-500',
		error: 'border-destructive [&>svg]:text-destructive',
		warning: 'border-yellow-500 [&>svg]:text-yellow-500',
		info: ''
	};
</script>

{#if $message}
	{@const colors = COLORS[$message.type]}
	{@const Icon = ICONS[$message.type]}
	<Alert.Root class={['border', colors]}>
		<Icon size={20} />
		<Alert.Title>{$message.message}</Alert.Title>
		{#if $message.description}
			<Alert.Description>{$message.description}</Alert.Description>
		{/if}
	</Alert.Root>
{/if}
