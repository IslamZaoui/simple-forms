<script lang="ts">
	import { LoginForm } from '@/components/forms/auth';

	let { data } = $props();
</script>

<div class="flex w-full items-center justify-center p-4">
	<LoginForm {data} />
</div>
