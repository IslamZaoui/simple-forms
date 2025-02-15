<script lang="ts">
	import thisIsFineImage from '@/assets/this-is-fine.jpg?enhanced'
	import { Button } from '@/components/ui/button'
	import { page } from '$app/state'
	import { PageWrapper } from '@/components/sidebar/page-slot'
	import { REDIRECT_USER_URL } from '@/config/auth'
</script>

<PageWrapper links={[{ label: `Error ${page.status}` }]}>
	<div class="flex h-full flex-col rounded-md bg-muted p-2 lg:flex-row">
		<div class="flex flex-1 items-center justify-center p-4 lg:justify-end lg:p-20">
			<div class="flex w-full max-w-md flex-col gap-4">
				<div class="space-y-2">
					<span class="text-lg font-medium text-muted-foreground">{page.status}</span>
					<h1 class="text-4xl font-bold tracking-tight">{page.error?.message}</h1>
					<p class="text-muted-foreground">
						{page.error?.details}
					</p>
				</div>
				<Button class="flex-1" variant="default" href={REDIRECT_USER_URL}>
					Go back To Dashboard
				</Button>
			</div>
		</div>
		<div class="flex flex-1 items-center justify-center p-4 lg:justify-start lg:p-20">
			<enhanced:img
				src={thisIsFineImage}
				alt="illustration"
				class="h-80 w-80 rounded-md object-contain lg:h-[450px] lg:w-[450px]"
			/>
		</div>
	</div>
</PageWrapper>
