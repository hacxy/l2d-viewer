import { atom } from 'jotai'

export const activeMotionAtom = atom<{ group: string; index: number } | null>(null)
export const motionProgressAtom = atom<number>(0)
export const motionDurationAtom = atom<number | null>(null)
