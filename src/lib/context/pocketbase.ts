import type { PBInstance } from '@/pocketbase'
import { getContext, setContext } from 'svelte'

const key = Symbol('pocketbase')

export const setPocketbase = (pb: PBInstance) => setContext(key, pb)
export const getPocketbase = () => getContext<PBInstance>(key)