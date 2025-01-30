<script lang="ts">
	import '../app.css'
	import PocketbaseProvider from '@/components/providers/pocketbase-provider.svelte'

	let { children } = $props()
</script>

<PocketbaseProvider>
	{@render children()}
</PocketbaseProvider>
