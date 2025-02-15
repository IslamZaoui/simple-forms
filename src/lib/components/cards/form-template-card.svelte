<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import type { FormTemplate } from '@prisma/client';
	import { formatTimeDistance } from '@/utils/time';

	type Props = {
		template: FormTemplate;
	};

	let { template }: Props = $props();
</script>

<a href="/app/form-templates/{template.id}">
	<Card.Card
		class="rounded-lg border border-muted bg-muted/50 shadow-sm ring-primary transition hover:shadow-md hover:ring-1"
	>
		<Card.CardHeader class="px-6 pt-5">
			<Card.CardTitle class="flex w-full items-center justify-between text-lg font-medium">
				<span class="line-clamp-1 truncate">{template.title}</span>
				<Badge class={!template.published ? 'bg-muted' : ''} variant={template.published ? 'default' : 'outline'}>
					{template.published ? 'Published' : 'Draft'}
				</Badge>
			</Card.CardTitle>
			<Card.Description class="line-clamp-3">
				{template.details || 'No details provided.'}
			</Card.Description>
		</Card.CardHeader>

		<Card.CardContent>
			<p class="text-sm text-muted-foreground">{formatTimeDistance(template.createdAt)}</p>
		</Card.CardContent>
	</Card.Card>
</a>
