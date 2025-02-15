<script lang="ts">
	import { RegisterForm } from '@/components/forms/auth'

	let { data } = $props()
</script>

<div class="flex w-full items-center justify-center p-4">
	<RegisterForm {data} />
</div>
