<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import MessageAlert from '@/components/forms/message-alert.svelte';
	import { forgotPasswordSchema } from '@/schemas/post-auth';
	import { Input } from '@/components/ui/input';

	let { data }: { data: { form: SuperValidated<Infer<typeof forgotPasswordSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(forgotPasswordSchema)
	});

	const { form: formData, enhance, delayed, message } = form;
</script>

<form class="mx-auto w-full max-w-sm space-y-5 py-1" method="POST" use:enhance>
	<MessageAlert {message} />

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email <span class="text-destructive">*</span></Form.Label>
				<Input
					type="email"
					placeholder="name@example.com..."
					autocomplete="email"
					{...props}
					bind:value={$formData.email}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>Enter the email associated with your account.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>Send Password Reset Code</span>
	</Form.Button>
</form>
