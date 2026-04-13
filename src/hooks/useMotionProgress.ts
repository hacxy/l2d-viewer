import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { activeMotionAtom, motionDurationAtom, motionProgressAtom, motionStartTimestampAtom } from '@/atoms/motions'

export function useMotionProgress() {
  const activeMotion = useAtomValue(activeMotionAtom)
  const duration = useAtomValue(motionDurationAtom)
  const startTimestamp = useAtomValue(motionStartTimestampAtom)
  const setProgress = useSetAtom(motionProgressAtom)

  useEffect(() => {
    if (!activeMotion || !duration || startTimestamp === null) {
      setProgress(0)
      return
    }

    let rafId: number

    const tick = () => {
      // performance.now() 与 motionstart 事件触发时使用同一时钟，精度最高
      const elapsed = (performance.now() - startTimestamp) / 1000
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [activeMotion, duration, startTimestamp])
}
