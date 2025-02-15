<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { PasswordInput } from '@/components/ui/password-input';
	import { registerSchema } from '@/schemas/auth';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import Separator from '@/components/ui/separator/separator.svelte';
	import PasswordValidation, { type PasswordError } from '@/components/forms/auth/password-validation.svelte';
	import MessageAlert from '@/components/forms/message-alert.svelte';
	import { LOGIN_URL } from '@/config/auth';

	let { data }: { data: { form: SuperValidated<Infer<typeof registerSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registerSchema)
	});

	const { form: formData, enhance, delayed, allErrors, message } = form;

	const passwordError: PasswordError | undefined = $derived.by(() => {
		const passwordRelated = $allErrors.filter((error) => error.path === 'password');
		return passwordRelated.length > 0 ? passwordRelated[0] : undefined;
	});
</script>

<form class="mx-auto w-full max-w-md space-y-5 py-1" method="POST" use:enhance>
	<MessageAlert {message} />

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input type="text" placeholder="example..." autocomplete="name" {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

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
		<Form.FieldErrors />
	</Form.Field>

	<div class="grid grid-cols-2 gap-4">
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password <span class="text-destructive">*</span></Form.Label>
					<PasswordInput
						placeholder="●●●●●●●●"
						autocomplete="new-password"
						{...props}
						bind:value={$formData.password}
					/>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="confirmPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password <span class="text-destructive">*</span></Form.Label>
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
	</div>

	<PasswordValidation {passwordError} />

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>Register</span>
	</Form.Button>

	<Separator />

	<div class="text-center text-sm text-muted-foreground">
		Already have an account? <a href={LOGIN_URL} class="text-primary underline">Login</a>
	</div>
</form>
