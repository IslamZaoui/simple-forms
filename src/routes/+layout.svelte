<script lang="ts">
	import '../app.css'
	import { FlashMessageProvider } from '@/components/providers'

	let { children } = $props()
</script>

<FlashMessageProvider />

{@render children()}
