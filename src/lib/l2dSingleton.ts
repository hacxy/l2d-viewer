import type { L2D } from 'l2d'

let instance: L2D | null = null

export function setL2DInstance(l: L2D | null) { instance = l }
export function getL2DInstance(): L2D | null { return instance }
