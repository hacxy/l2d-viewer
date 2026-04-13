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
  }, [enabled, l2dRef.current])
}
