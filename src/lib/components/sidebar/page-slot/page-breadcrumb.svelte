<script lang="ts" module>
	export type Link = {
		label: string
		href?: string
	}
</script>

<script lang="ts">
	import * as Breadcrumb from '@/components/ui/breadcrumb'
	import * as Drawer from '@/components/ui/drawer'
	import * as DropdownMenu from '@/components/ui/dropdown-menu'
	import { Separator } from '@/components/ui/separator'
	import { IsMobile } from '@/hooks/is-mobile.svelte'
	import { buttonVariants } from '@/components/ui/button'

	let { links = undefined }: { links?: Link[] } = $props()

	const ITEMS_TO_DISPLAY = 3
	let open = $state(false)
	const isMobile = new IsMobile()
</script>

{#if links}
	<Separator orientation="vertical" class="mr-2 h-4" />
	<Breadcrumb.Root>
		<Breadcrumb.List>
			{#if links.length === 1}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={links[0].href}>
						{links[0].label}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			{:else}
				{#if links.length > ITEMS_TO_DISPLAY}
					<Breadcrumb.Item>
						<Breadcrumb.Link href={links[0].href}>
							{links[0].label}
						</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						{#if !isMobile.current}
							<DropdownMenu.Root bind:open>
								<DropdownMenu.Trigger class="flex items-center gap-1" aria-label="Toggle menu">
									<Breadcrumb.Ellipsis class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="start">
									{#each links.slice(1, -1) as item}
										<DropdownMenu.Item>
											<a href={item.href ? item.href : '#'}>
												{item.label}
											</a>
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<Drawer.Root bind:open>
								<Drawer.Trigger aria-label="Toggle Menu">
									<Breadcrumb.Ellipsis class="size-4" />
								</Drawer.Trigger>
								<Drawer.Content>
									<Drawer.Header class="text-left">
										<Drawer.Title>Navigate to</Drawer.Title>
										<Drawer.Description>Select a page to navigate to.</Drawer.Description>
									</Drawer.Header>
									<div class="grid gap-1 px-4">
										{#each links.slice(1, -1) as item}
											<a href={item.href ? item.href : '#'} class="py-1 text-sm">
												{item.label}
											</a>
										{/each}
									</div>
									<Drawer.Footer class="pt-4">
										<Drawer.Close class={buttonVariants({ variant: 'outline' })}>
											Close
										</Drawer.Close>
									</Drawer.Footer>
								</Drawer.Content>
							</Drawer.Root>
						{/if}
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
				{/if}

				{#each links.slice(links.length > ITEMS_TO_DISPLAY ? -1 : 0) as item}
					{@const isLast = item === links[links.length - 1]}
					<Breadcrumb.Item>
						{#if item.href}
							<Breadcrumb.Link href={item.href} class="max-w-20 truncate md:max-w-none">
								{item.label}
							</Breadcrumb.Link>
						{:else}
							<Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
								{item.label}
							</Breadcrumb.Page>
						{/if}
						{#if !isLast}
							<Breadcrumb.Separator />
						{/if}
					</Breadcrumb.Item>
				{/each}
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>
{/if}
