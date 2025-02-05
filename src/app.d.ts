import { FlashMessage } from '@/components/providers'
import type { AuthData } from '@/server/auth/session'
import type { UserWithoutSecrets } from '@/server/database'

declare global {
	type User = UserWithoutSecrets
	namespace App {
		interface Error {
			details?: string
		}
		interface Locals {
			auth(): AuthData | null
		}
		interface PageData {
			flash?: FlashMessage
		}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			type Message = FlashMessage
		}
	}
}

export {}
