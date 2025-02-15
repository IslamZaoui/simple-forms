export { default as AddFormFieldForm } from './add-form-field.svelte';
export { default as CreateUpdateFormTemplateForm } from './create-update-form.svelte';
export { default as EditFormFieldForm } from './edit-form-field.svelte';
export { default as TemplatesSearchForm } from './templates-search-form.svelte';

export const templateStatus = ['all', 'draft', 'published'] as const;
export type templateStatus = (typeof templateStatus)[number];

type Labels = {
	[key in templateStatus]: string;
};
export const templateStatusLabels: Labels = {
	all: 'All',
	draft: 'Draft',
	published: 'Published'
};
