<script lang="ts">
	import { VerifyEmailForm, ResendVerificationEmailForm } from '@/components/forms/post-auth'
	import { Button } from '@/components/ui/form'
	import { LOGOUT_URL } from '@/config/auth'

	let { data } = $props()
</script>

<div class="dots-background"></div>

<main class="flex min-h-screen w-full items-center justify-center p-4">
	<header class="container absolute top-0 flex h-14 items-center">
		<div class="flex w-full items-center justify-between">
			<a href="/verify-email" class="flex items-center gap-2 font-semibold">
				<img src="/favicon.png" alt="Simple Forms Logo" class="size-6" />
				<span>Simple Forms</span>
			</a>
			<Button variant="ghost" size="sm" href={LOGOUT_URL}>Logout</Button>
		</div>
	</header>

	<div class="space-y-2">
		<VerifyEmailForm {data} />
		<ResendVerificationEmailForm />
	</div>
</main>
