import type { RequestEvent } from '@sveltejs/kit'
import type { Rate, RateLimiterPlugin } from 'sveltekit-rate-limiter/server'

export type UserLimiterExtra = { userId: string | undefined }

export class UserLimiterPlugin implements RateLimiterPlugin {
	readonly rate: Rate | Rate[]

	constructor(rate: Rate | Rate[]) {
		this.rate = rate
	}

	async hash(_: RequestEvent, extraData: UserLimiterExtra) {
		return extraData.userId ?? null
	}
}
