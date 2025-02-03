import { authHandle } from '@/server/auth/hooks'
import { rateLimitHandle } from '@/server/rate-limiter'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(rateLimitHandle, authHandle)
