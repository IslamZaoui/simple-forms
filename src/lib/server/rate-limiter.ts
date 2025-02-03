import { error, type Handle } from '@sveltejs/kit'
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server'

const limiter = new RetryAfterRateLimiter({
	IPUA: [100, 's']
})

export const rateLimitHandle: Handle = async ({ event, resolve }) => {
	const status = await limiter.check(event)
	if (status.limited) {
		return error(429, {
			message: 'Rate limit exceeded',
			details: `please try again in ${status.retryAfter} seconds`
		})
	}
	return resolve(event)
}
