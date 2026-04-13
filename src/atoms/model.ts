import { atom } from 'jotai'

export const modelUrlAtom = atom<string>('')
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'
export const loadingStatusAtom = atom<LoadStatus>('idle')
export const loadingErrorAtom = atom<string | null>(null)
export const loadProgressAtom = atom<{ loaded: number; total: number }>({ loaded: 0, total: 0 })
export const expressionsAtom = atom<string[]>([])
export const motionsAtom = atom<Record<string, string[]>>({})
export const hitAreaBoundsAtom = atom<Array<{ name: string; x: number; y: number; w: number; h: number }>>([])
export const paramsAtom = atom<Record<string, number>>({})
