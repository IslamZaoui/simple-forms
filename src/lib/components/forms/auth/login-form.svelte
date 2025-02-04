<script lang="ts">
	import * as Form from '@/components/ui/form'
	import { Input } from '@/components/ui/input'
	import { PasswordInput } from '@/components/ui/password-input'
	import { loginSchema } from '@/schemas/auth'
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle'
	import Separator from '@/components/ui/separator/separator.svelte'
	import MessageAlert from '@/components/forms/message-alert.svelte'
	import { Checkbox } from '@/components/ui/checkbox'

	let { data }: { data: { form: SuperValidated<Infer<typeof loginSchema>> } } = $props()

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	})

	const { form: formData, enhance, delayed, message } = form
</script>

<form class="mx-auto w-full max-w-md space-y-5 py-1" method="POST" use:enhance>
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
		<Form.FieldErrors />
	</Form.Field>

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

	<div class="flex items-center justify-between">
		<Form.Field {form} name="rememberMe" class="flex flex-row items-start space-x-3 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.rememberMe} />
					<div class="leading-none">
						<Form.Label>Remember me</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<a class="text-sm text-primary hover:underline" href="#">Forgot Password?</a>
	</div>

	<Form.Button class="relative w-full" disabled={$delayed}>
		{#if $delayed}
			<SpinnerIcon class="absolute left-4 animate-spin" />
		{/if}
		<span>Login</span>
	</Form.Button>

	<Separator />

	<div class="text-center text-sm text-muted-foreground">
		Don't have an account? <a href="/auth/register" class="text-primary underline">Register</a>
	</div>
</form>
