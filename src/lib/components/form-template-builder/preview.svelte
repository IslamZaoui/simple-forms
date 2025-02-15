<script lang="ts">
	import type { FormTemplate, FormTemplateField } from '@prisma/client';
	import TemplatePreviewForm from './template-preview-form.svelte';
	import * as Card from '@/components/ui/card';

	type Props = {
		template: FormTemplate;
		fields: FormTemplateField[];
	};

	let { fields, template }: Props = $props();
</script>

<div class="size-full flex-1 rounded-xl border border-muted bg-muted/50 p-4">
	<h3 class="text-2xl font-bold">Form Template Preview</h3>
	<div class="flex h-full items-center justify-center p-4">
		<Card.Root class="w-full max-w-[450px]">
			<Card.Header>
				<Card.Title>{template.title}</Card.Title>
				{#if template.details}
					<Card.Description>{template.details}</Card.Description>
				{/if}
			</Card.Header>
			<Card.Content>
				<TemplatePreviewForm {fields} />
			</Card.Content>
		</Card.Root>
	</div>
</div>
