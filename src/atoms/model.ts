import { atom } from 'jotai'
import type { ParamInfo } from 'l2d'

export const modelUrlAtom = atom<string>('')
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'
export const loadingStatusAtom = atom<LoadStatus>('idle')
export const loadingErrorAtom = atom<string | null>(null)
export const loadProgressAtom = atom<{ loaded: number; total: number }>({ loaded: 0, total: 0 })
export const expressionsAtom = atom<string[]>([])
export const motionsAtom = atom<Record<string, string[]>>({})
export const hitAreaBoundsAtom = atom<Array<{ name: string; x: number; y: number; w: number; h: number }>>([])
// loaded 事件时从 getParams() 一次性写入静态定义（id / min / max / default）
export const paramsAtom = atom<ParamInfo[]>([])
// RAF 循环每帧写入最新 value，key 为参数 id
export const paramValuesAtom = atom<Record<string, number>>({})
