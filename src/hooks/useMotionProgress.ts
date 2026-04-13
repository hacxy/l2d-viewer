import { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { activeMotionAtom, motionDurationAtom, motionProgressAtom } from '@/atoms/motions'

export function useMotionProgress() {
  const activeMotion = useAtomValue(activeMotionAtom)
  const duration = useAtomValue(motionDurationAtom)
  const setProgress = useSetAtom(motionProgressAtom)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!activeMotion || !duration) {
      setProgress(0)
      startTimeRef.current = null
      return
    }

    startTimeRef.current = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const start = startTimeRef.current ?? now
      const elapsed = (now - start) / 1000
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [activeMotion, duration])
}
