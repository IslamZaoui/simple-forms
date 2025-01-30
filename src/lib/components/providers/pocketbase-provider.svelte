<script lang="ts">
	import { setPocketbase } from '@/context/pocketbase'
	import { createInstance } from '@/pocketbase'

	let { children } = $props()

	$effect.pre(() => {
		const pb = createInstance()

		pb.authStore.loadFromCookie(document.cookie)
		pb.authStore.onChange(() => {
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
		}, true)

		setPocketbase(pb)
	})
</script>

{@render children()}
