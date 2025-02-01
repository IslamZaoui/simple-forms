<script lang="ts">
	import { Button } from '@/components/ui/button'
	import { Input } from '@/components/ui/input'
	import { Separator } from '@/components/ui/separator'
	import GithubIcon from 'lucide-svelte/icons/github'
</script>

<main class="container flex flex-1 items-center justify-center py-10">
	<div class="w-full max-w-[400px] space-y-6">
		<div class="space-y-2 text-center">
			<h1 class="text-2xl font-bold">Welcome to Simple Forms</h1>
			<p class="text-sm text-muted-foreground">Choose your preferred sign in method</p>
		</div>

		<div class="flex flex-col gap-2">
			<Button variant="outline" class="relative">
				<GithubIcon class="absolute left-4 size-4" />
				Continue with GitHub
			</Button>
		</div>

		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<Separator />
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
			</div>
		</div>

		<div class="space-y-4">
			<div class="space-y-2">
				<Input type="email" placeholder="name@example.com" class="h-11" />
			</div>
			<Button class="w-full">Continue with Email</Button>
		</div>

		<div class="px-8 text-center text-sm text-muted-foreground">
			<p>
				By clicking continue, you agree to our{' '}
				<a href="#" class="underline underline-offset-4 hover:text-primary">Terms of Service</a>
				{' '}and{' '}
				<a href="#" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>
				.
			</p>
		</div>
	</div>
</main>
