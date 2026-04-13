import { atom } from 'jotai'

export const activeMotionAtom = atom<{ group: string; index: number } | null>(null)
export const motionProgressAtom = atom<number>(0)
export const motionDurationAtom = atom<number | null>(null)
// 事件触发瞬间的时间戳，用于精准对齐进度
export const motionStartTimestampAtom = atom<number | null>(null)
