import { Flash } from '@/components/providers';
import type { AuthData } from '@/server/auth/session';

declare global {
	namespace App {
		interface Error {
			details?: string;
		}
		interface Locals {
			auth(): AuthData | null;
		}
		interface PageData {
			flash?: Flash;
		}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			type Message = Flash;
		}
	}
}

export {};
