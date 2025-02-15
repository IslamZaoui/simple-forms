<script lang="ts" module>
	export type FlashMessage = {
		type: 'success' | 'error' | 'warning' | 'info';
		message: string;
		description?: string;
	};
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster } from '@/components/ui/sonner';

	const flash = getFlash(page);

	$effect(() => {
		if (!$flash) return;
		const { type, message, description } = $flash;

		switch (type) {
			case 'success':
				toast.success(message, { description });
				break;
			case 'error':
				toast.error(message, { description });
				break;
			case 'warning':
				toast.warning(message, { description });
				break;
			case 'info':
				toast.info(message, { description });
				break;
		}

		$flash = undefined;
	});
</script>

<Toaster closeButton richColors />
