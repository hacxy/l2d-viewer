import { atom } from 'jotai'
import { modelUrlAtom } from './model'
import { generateLoadCode } from '../lib/codegenUtils'

export const posXAtom = atom<number>(0)
export const posYAtom = atom<number>(0)
export const scaleAtom = atom<number>(1)
export const hitAreaOverlayEnabledAtom = atom<boolean>(false)
export const themeAtom = atom<'light' | 'dark'>('dark')

export const loadOptionsCodeAtom = atom((get) =>
  generateLoadCode({
    path: get(modelUrlAtom),
    position: [get(posXAtom), get(posYAtom)],
    scale: get(scaleAtom),
  })
)
