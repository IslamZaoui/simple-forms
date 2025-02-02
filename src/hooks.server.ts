import { authHandle } from '@/server/auth/hooks'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(authHandle)
