<script lang="ts">
	import thisIsFineImage from '@/assets/this-is-fine.jpg?enhanced';
	import { Button } from '@/components/ui/button';
	import BlindsIcon from 'lucide-svelte/icons/blinds';
	import CircleHelpIcon from 'lucide-svelte/icons/circle-help';
	import { page } from '$app/state';
</script>

<div class="dots-background"></div>

<main class="flex min-h-dvh flex-col lg:flex-row">
	<div class="flex flex-1 items-center justify-center p-4 lg:justify-end lg:p-20">
		<div class="w-full max-w-md space-y-6">
			<div class="space-y-2">
				<span class="text-lg font-medium text-muted-foreground">{page.status}</span>
				<h1 class="text-4xl font-bold tracking-tight">{page.error?.message}</h1>
				<p class="text-muted-foreground">
					{page.error?.details}
				</p>
			</div>
			<div class="flex flex-col gap-4 sm:flex-row">
				<Button class="flex-1 gap-2" variant="default" href="/">
					<BlindsIcon class="size-4" />
					Go back home
				</Button>
				<Button class="flex-1 gap-2" variant="outline">
					<CircleHelpIcon class="size-4" />
					Contact support
				</Button>
			</div>
		</div>
	</div>
	<div class="flex flex-1 items-center justify-center p-4 lg:justify-start lg:p-20">
		<div class="overflow-hidden rounded-lg border bg-muted/40 p-2 shadow-sm">
			<enhanced:img
				src={thisIsFineImage}
				alt="illustration"
				class="h-80 w-80 rounded-md object-contain lg:h-[450px] lg:w-[450px]"
			/>
		</div>
	</div>
</main>
