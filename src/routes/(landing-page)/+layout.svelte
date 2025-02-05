<script lang="ts">
	import { Button } from '@/components/ui/button'
	import { LOGIN_URL } from '@/config/auth'

	let { children } = $props()
</script>

<div class="dots-background"></div>

<div class="flex min-h-screen w-full flex-col text-foreground">
	<header class="container flex h-14 items-center">
		<div class="flex w-full items-center justify-between">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<img src="/favicon.png" alt="Simple Forms Logo" class="size-6" />
				<span>Simple Forms</span>
			</a>
			<div class="space-x-2">
				<Button variant="ghost" size="sm">Contact</Button>
				<Button variant="ghost" size="sm" href={LOGIN_URL}>Login</Button>
			</div>
		</div>
	</header>

	{@render children()}

	<footer class="container pb-8">
		<div class="flex items-center justify-center gap-4 text-sm text-muted-foreground">
			<a href="#" class="hover:text-primary">Help</a>
			<a href="#" class="hover:text-primary">Terms</a>
			<a href="#" class="hover:text-primary">Privacy</a>
		</div>
	</footer>
</div>
