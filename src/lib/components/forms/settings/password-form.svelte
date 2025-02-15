<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import MessageAlert from '@/components/forms/message-alert.svelte';
	import { changePasswordSchema } from '@/schemas/settings';
	import { Separator } from '@/components/ui/separator';
	import type { UserWithoutSecrets } from '@/server/database';
	import { PasswordInput } from '@/components/ui/password-input';
	import { FORGOT_PASSWORD_URL } from '@/config/auth';
	import { Checkbox } from '@/components/ui/checkbox';

	type Props = {
		data: {
			changePasswordForm: SuperValidated<Infer<typeof changePasswordSchema>>;
			user: UserWithoutSecrets;
		};
	};

	let { data }: Props = $props();

	const form = superForm(data.changePasswordForm, {
		validators: zod(changePasswordSchema)
	});

	const { form: formData, enhance, delayed, message } = form;
</script>

<form class="flex flex-col rounded-md border border-muted bg-muted/50" action="?/password" method="POST" use:enhance>
	<div class="space-y-2 p-4">
		<h2 class="text-2xl font-bold">Change Password</h2>

		<Form.Field {form} name="currentPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Current password</Form.Label>
					<PasswordInput
						parentClass="max-w-[350px]"
						placeholder="●●●●●●●●"
						autocomplete="current-password"
						bind:value={$formData.currentPassword}
						{...props}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="newPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>New password</Form.Label>
					<PasswordInput
						parentClass="max-w-[350px]"
						placeholder="●●●●●●●●"
						autocomplete="new-password"
						bind:value={$formData.newPassword}
						{...props}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="confirmNewPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm new password</Form.Label>
					<PasswordInput
						parentClass="max-w-[350px]"
						placeholder="●●●●●●●●"
						autocomplete="new-password"
						bind:value={$formData.confirmNewPassword}
						{...props}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="logout" class="flex flex-row items-start space-x-3 space-y-0 py-4">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.logout} />
					<div class="space-y-1 leading-none">
						<Form.Label>Logout from other devices?</Form.Label>
						<Form.Description>When enabled, you will be logged out from all other devices.</Form.Description>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>

		<MessageAlert {message} />
	</div>
	<Separator />
	<div class="flex items-center justify-between px-4 py-2">
		<a href={FORGOT_PASSWORD_URL} class="text-sm text-primary underline hover:no-underline"
			>Forgot your current password?</a
		>

		<Form.Button
			disabled={$delayed ||
				!$formData.currentPassword ||
				!$formData.newPassword ||
				!$formData.confirmNewPassword ||
				$formData.newPassword !== $formData.confirmNewPassword}
		>
			{#if $delayed}
				<SpinnerIcon class="mr-2 animate-spin" />
			{/if}
			<span>Save</span>
		</Form.Button>
	</div>
</form>
