<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
</script>

<form class="flex w-full items-center justify-between gap-2" action="?/resend" method="post" use:enhance>
	<span class="text-sm text-muted-foreground">didnt receive the email?</span>
	<Button variant="link" type="submit">Resend</Button>
</form>
