<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { LOGIN_URL, REDIRECT_USER_URL } from '@/config/auth';

	let { data, children } = $props();
</script>

<div class="dots-background"></div>

<div class="flex min-h-screen w-full flex-col text-foreground">
	<header class="container flex h-14 items-center">
		<div class="flex w-full items-center justify-between">
			<a href={data.user ? REDIRECT_USER_URL : '/'} class="flex items-center gap-2 font-semibold">
				<img src="/favicon.png" alt="Simple Forms Logo" class="size-6" />
				<span>Simple Forms</span>
			</a>

			{#if !data.user}
				<Button variant="ghost" size="sm" href={LOGIN_URL}>Login</Button>
			{:else}
				<div class="space-x-2">
					{#if data.user.emailVerified}
						<Button variant="ghost" size="sm" href={REDIRECT_USER_URL}>Back to Dashboard</Button>
					{/if}
					<Button variant="ghost" size="sm" href={LOGIN_URL}>Logout</Button>
				</div>
			{/if}
		</div>
	</header>

	<main class="container flex flex-1 items-center justify-center py-10">
		{@render children()}
	</main>
</div>
