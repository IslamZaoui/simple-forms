<script lang="ts" module>
	export type PasswordError = {
		path: string;
		messages: string[];
	};
</script>

<script lang="ts">
	import { Alert, AlertDescription } from '@/components/ui/alert';

	interface Props {
		passwordError: PasswordError | undefined;
	}

	let { passwordError }: Props = $props();
	const isValid = $derived(!passwordError || passwordError.messages.length === 0);
</script>

<Alert variant={isValid ? 'default' : 'destructive'} class="p-2">
	<AlertDescription>
		{#if isValid || !passwordError}
			<p class="text-sm text-green-500">Your password meets all requirements!</p>
		{:else}
			<ul class="list-disc space-y-1 pl-4 text-sm text-destructive">
				{#each passwordError.messages as message, i (i)}
					<li>{message}</li>
				{/each}
			</ul>
		{/if}
	</AlertDescription>
</Alert>
