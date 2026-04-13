import { atomWithStorage } from 'jotai/utils'

export const urlHistoryAtom = atomWithStorage<string[]>('l2d-viewer-history', [])
