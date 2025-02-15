<script lang="ts">
	import * as Form from '@/components/ui/form';
	import * as InputOTP from '@/components/ui/input-otp';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import MessageAlert from '@/components/forms/message-alert.svelte';
	import { verifyEmailSchema } from '@/schemas/post-auth';

	let { data }: { data: { form: SuperValidated<Infer<typeof verifyEmailSchema>>; email: string } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(verifyEmailSchema)
	});

	const { form: formData, enhance, delayed, message } = form;
</script>

<form class="mx-auto w-full max-w-sm space-y-5 py-1" action="?/verify" method="POST" use:enhance>
	<MessageAlert {message} />

	<Form.Field {form} name="code">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Code <span class="text-destructive">*</span></Form.Label>
				<InputOTP.Root {...props} bind:value={$formData.code} maxlength={6} pattern="^[A-Z0-9]+$">
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 3) as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(3, 6) as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>Enter the code sent to {data.email}.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>Verify Email</span>
	</Form.Button>
</form>
