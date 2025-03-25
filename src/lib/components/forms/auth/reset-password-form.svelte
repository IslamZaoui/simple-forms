<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import MessageAlert from '@/components/forms/message-alert.svelte';
	import { resetPasswordSchema } from '@/schemas/auth';
	import { PasswordInput } from '@/components/ui/password-input';
	import PasswordValidation, { type PasswordError } from './password-validation.svelte';

	let { data }: { data: { form: SuperValidated<Infer<typeof resetPasswordSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetPasswordSchema)
	});

	const { form: formData, enhance, delayed, message, allErrors } = form;

	const passwordError: PasswordError | undefined = $derived.by(() => {
		const passwordRelated = $allErrors.filter((error) => error.path === 'password');
		return passwordRelated.length > 0 ? passwordRelated[0] : undefined;
	});
</script>

<form class="mx-auto w-full max-w-sm space-y-5 py-1" method="POST" use:enhance>
	<MessageAlert {message} />

	<input type="hidden" name="token" value={$formData.token} />

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>New Password <span class="text-destructive">*</span></Form.Label>
				<PasswordInput placeholder="●●●●●●●●" autocomplete="new-password" {...props} bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm New Password <span class="text-destructive">*</span></Form.Label>
				<PasswordInput
					placeholder="●●●●●●●●"
					autocomplete="new-password"
					{...props}
					bind:value={$formData.confirmPassword}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<PasswordValidation {passwordError} />

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>Reset Password</span>
	</Form.Button>
</form>
