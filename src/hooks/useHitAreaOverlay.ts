import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import type { L2D } from 'l2d'
import { hitAreaBoundsAtom } from '@/atoms/model'

export function useHitAreaOverlay(
  l2dRef: React.RefObject<L2D | null>,
  enabled: boolean
) {
  const setHitAreaBounds = useSetAtom(hitAreaBoundsAtom)

  useEffect(() => {
    if (!enabled || !l2dRef.current) return
    let rafId: number
    const loop = () => {
      const bounds = l2dRef.current?.getHitAreaBounds() ?? []
      setHitAreaBounds(bounds)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
    // l2dRef 是稳定的 ref 容器；setHitAreaBounds 是稳定的 Jotai setter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}
