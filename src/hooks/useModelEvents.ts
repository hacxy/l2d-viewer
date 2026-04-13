import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import type { L2D } from 'l2d'
import { loadingStatusAtom, loadProgressAtom, expressionsAtom, motionsAtom } from '@/atoms/model'
import { activeMotionAtom, motionDurationAtom, motionProgressAtom } from '@/atoms/motions'
import { activeExpressionAtom } from '@/atoms/expressions'

export function useModelEvents(l2d: L2D | null) {
  const setStatus = useSetAtom(loadingStatusAtom)
  const setProgress = useSetAtom(loadProgressAtom)
  const setExpressions = useSetAtom(expressionsAtom)
  const setMotions = useSetAtom(motionsAtom)
  const setActiveMotion = useSetAtom(activeMotionAtom)
  const setMotionDuration = useSetAtom(motionDurationAtom)
  const setMotionProgress = useSetAtom(motionProgressAtom)
  const setActiveExpression = useSetAtom(activeExpressionAtom)

  useEffect(() => {
    if (!l2d) return

    l2d.on('loadstart', (total) => {
      setStatus('loading')
      setProgress({ loaded: 0, total })
    })
    l2d.on('loadprogress', (loaded, total) => {
      setProgress({ loaded, total })
    })
    l2d.on('loaded', () => {
      setStatus('loaded')
      setExpressions(l2d.getExpressions())
      setMotions(l2d.getMotions())
    })
    l2d.on('motionstart', (group, index, duration) => {
      setActiveMotion({ group, index })
      setMotionDuration(duration)
      setMotionProgress(0)
    })
    l2d.on('motionend', () => {
      setActiveMotion(null)
      setMotionProgress(0)
    })
    l2d.on('expressionstart', (id) => setActiveExpression(id))
    l2d.on('expressionend', () => setActiveExpression(null))
  }, [l2d])
}
