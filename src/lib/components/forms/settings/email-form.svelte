<script lang="ts">
	import * as Form from '@/components/ui/form'
	import { Input } from '@/components/ui/input'
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle'
	import MessageAlert from '@/components/forms/message-alert.svelte'
	import { changeEmailSchema } from '@/schemas/settings'
	import { Separator } from '@/components/ui/separator'
	import type { UserWithoutSecrets } from '@/server/database'

	type Props = {
		data: {
			changeEmailForm: SuperValidated<Infer<typeof changeEmailSchema>>
			user: UserWithoutSecrets
		}
	}

	let { data }: Props = $props()

	const form = superForm(data.changeEmailForm, {
		validators: zod(changeEmailSchema)
	})

	const { form: formData, enhance, delayed, message } = form
</script>

<form
	class="flex flex-col rounded-md border border-muted bg-muted/50"
	action="?/email"
	method="POST"
	use:enhance
>
	<div class="p-4">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-2xl font-bold">Email</Form.Label>
					<Form.Description>Your personal email</Form.Description>
					<Input
						class="max-w-[350px]"
						type="text"
						placeholder="example..."
						autocomplete="name"
						{...props}
						bind:value={$formData.email}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<MessageAlert {message} />
	</div>
	<Separator />
	<div class="flex items-center justify-between px-4 py-2">
		<p class="text-sm text-muted-foreground">Email is required</p>

		<Form.Button disabled={$delayed || !$formData.email || $formData.email === data.user.email}>
			{#if $delayed}
				<SpinnerIcon class="mr-2 animate-spin" />
			{/if}
			<span>Save</span>
		</Form.Button>
	</div>
</form>
