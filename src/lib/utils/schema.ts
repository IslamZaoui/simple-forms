import type { FormTemplateField } from '@prisma/client'
import { z } from 'zod'

function fieldShemaCreator(field: FormTemplateField) {
	const { label, min, max } = field

	const text = () => {
		let textFieldSchema = z.string({ required_error: `${label} is required.` })
		if (min) {
			textFieldSchema = textFieldSchema.min(min, `${label} must be at least ${min} characters long`)
		}
		if (max) {
			textFieldSchema = textFieldSchema.max(max, `${label} must be at most ${max} characters long`)
		}
		return textFieldSchema
	}

	const email = () => {
		return z
			.string({ required_error: `${label} is required.` })
			.email(`${label} must be a valid email address`)
	}

	const number = () => {
		let numberFieldSchema = z.number({ required_error: `${label} is required.` })
		if (min) {
			numberFieldSchema = numberFieldSchema.min(min, `${label} must be at least ${min}`)
		}
		if (max) {
			numberFieldSchema = numberFieldSchema.max(max, `${label} must be at most ${max}`)
		}
		return numberFieldSchema
	}

	return {
		text,
		textarea: text,
		email,
		number
	}
}

export const formTemplateSchemaGenerator = (fields: FormTemplateField[]) => {
	const schemaDefinition: Record<string, z.ZodTypeAny> = {}

	for (const field of fields) {
		schemaDefinition[field.id] = fieldShemaCreator(field)[field.type]()
	}

	return z.object(schemaDefinition)
}
