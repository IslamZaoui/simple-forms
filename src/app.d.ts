import { FlashMessage } from '@/components/providers'

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			flash?: FlashMessage
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
