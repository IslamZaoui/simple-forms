<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { FlashMessageProvider } from '@/components/providers';

	let { children } = $props();
</script>

<ModeWatcher />
<FlashMessageProvider />

{@render children()}
