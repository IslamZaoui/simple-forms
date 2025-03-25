import { Flash } from '@/components/providers';
import type { Session, User } from 'better-auth';

declare global {
	namespace App {
		interface Error {
			details?: string;
		}
		interface Locals {
			auth: { user: User; session: Session } | null;
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
