import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { type RecordModel } from 'pocketbase'
import { PocketBaseTS } from 'pocketbase-ts'

export function createInstance() {
	return new PocketBaseTS<Schema>(PUBLIC_POCKETBASE_URL)
}

export type PBInstance = ReturnType<typeof createInstance>

/* _____________ Schema _____________ */
interface PocketBaseCollection extends RecordModel {
	id: string
	created: string
	updated: string
}

export interface User extends PocketBaseCollection {
	username: string
	email: string
	emailVisibility: boolean
	verified: boolean
}

type Schema = {
	users: { type: User }
}