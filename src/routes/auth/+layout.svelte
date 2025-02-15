<script lang="ts">
	let { children } = $props();
</script>

<div class="dots-background"></div>

<main class="relative flex min-h-screen w-full items-center justify-center p-4">
	<header class="container absolute top-0 flex h-14 items-center">
		<div class="flex w-full items-center justify-between">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<img src="/favicon.png" alt="Simple Forms Logo" class="size-6" />
				<span>Simple Forms</span>
			</a>
		</div>
	</header>

	{@render children()}
</main>
