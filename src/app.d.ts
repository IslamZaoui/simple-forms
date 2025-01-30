import type { PBInstance, User } from '@/pocketbase'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PBInstance
			user: User
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}