import { useRef, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { hitAreaOverlayEnabledAtom } from '@/atoms/viewer'
import { useL2D } from '@/hooks/useL2D'
import { useHitAreaOverlay } from '@/hooks/useHitAreaOverlay'
import { useDragToReposition } from '@/hooks/useDragToReposition'
import HitAreaOverlay from './HitAreaOverlay'
import LoadingOverlay from './LoadingOverlay'

export default function CanvasStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const l2dRef = useL2D(canvasRef)
  const hitAreaOverlayEnabled = useAtomValue(hitAreaOverlayEnabledAtom)

  useHitAreaOverlay(l2dRef, hitAreaOverlayEnabled)
  useDragToReposition(canvasRef, l2dRef)

  useEffect(() => {
    if (!canvasRef.current || !l2dRef.current) return
    const observer = new ResizeObserver(() => {
      l2dRef.current?.resize()
    })
    observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [l2dRef.current])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {hitAreaOverlayEnabled && <HitAreaOverlay />}
      <LoadingOverlay />
    </div>
  )
}
