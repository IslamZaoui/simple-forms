import type { FormTemplateFieldType } from '@prisma/client'
import HashIcon from 'lucide-svelte/icons/hash'
import MailIcon from 'lucide-svelte/icons/mail'
import TextIcon from 'lucide-svelte/icons/text'
import InputIcon from 'lucide-svelte/icons/text-cursor-input'

export const FIELD_TYPE = ['text', 'textarea', 'email', 'number'] as const

export type FieldLabels = {
	[key in FormTemplateFieldType]: {
		label: string
		Icon: ConstructorOfATypedSvelteComponent
	}
}

export const fieldLabels: FieldLabels = {
	text: {
		label: 'Short Text Field',
		Icon: InputIcon
	},
	textarea: {
		label: 'Long Text Field',
		Icon: TextIcon
	},
	email: {
		label: 'Email Field',
		Icon: MailIcon
	},
	number: {
		label: 'Number Field',
		Icon: HashIcon
	}
}
