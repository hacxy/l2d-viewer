import { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { L2D } from 'l2d'
import { posXAtom, posYAtom, scaleAtom } from '@/atoms/viewer'

export function useDragToReposition(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  l2dRef: React.RefObject<L2D | null>
) {
  const posX = useAtomValue(posXAtom)
  const posY = useAtomValue(posYAtom)
  const scale = useAtomValue(scaleAtom)
  const setPosX = useSetAtom(posXAtom)
  const setPosY = useSetAtom(posYAtom)
  const setScale = useSetAtom(scaleAtom)

  // 用 ref 持有最新值，避免 wheel handler 因 deps 变化频繁重建
  const scaleRef = useRef(scale)
  useEffect(() => { scaleRef.current = scale }, [scale])

  const dragState = useRef<{
    startX: number
    startY: number
    startPosX: number
    startPosY: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: posX,
        startPosY: posY,
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragState.current || !l2dRef.current) return
      const { startX, startY, startPosX, startPosY } = dragState.current
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const newX = Math.max(-2, Math.min(2, startPosX + ((e.clientX - startX) / w) * 4))
      const newY = Math.max(-2, Math.min(2, startPosY - ((e.clientY - startY) / h) * 4))
      l2dRef.current.setPosition(newX, newY)
      setPosX(newX)
      setPosY(newY)
    }

    const onPointerUp = () => {
      dragState.current = null
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!l2dRef.current) return
      const factor = e.deltaY > 0 ? 0.95 : 1.05
      const newScale = Math.max(0.1, Math.min(5, scaleRef.current * factor))
      scaleRef.current = newScale
      l2dRef.current.setScale(newScale)
      setScale(newScale)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [posX, posY, l2dRef.current])
}
