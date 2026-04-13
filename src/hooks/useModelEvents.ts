import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import type { L2D } from 'l2d'
import { loadingStatusAtom, loadProgressAtom, expressionsAtom, motionsAtom, paramsAtom, paramValuesAtom } from '@/atoms/model'
import { activeMotionAtom, motionDurationAtom, motionProgressAtom, motionStartTimestampAtom } from '@/atoms/motions'
import { activeExpressionAtom } from '@/atoms/expressions'

export function useModelEvents(l2d: L2D | null) {
  const setStatus = useSetAtom(loadingStatusAtom)
  const setProgress = useSetAtom(loadProgressAtom)
  const setExpressions = useSetAtom(expressionsAtom)
  const setMotions = useSetAtom(motionsAtom)
  const setParams = useSetAtom(paramsAtom)
  const setParamValues = useSetAtom(paramValuesAtom)
  const setActiveMotion = useSetAtom(activeMotionAtom)
  const setMotionDuration = useSetAtom(motionDurationAtom)
  const setMotionProgress = useSetAtom(motionProgressAtom)
  const setMotionStartTimestamp = useSetAtom(motionStartTimestampAtom)
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
      // 一次性建立静态参数定义列表（id / min / max / default）
      // Cubism2: _$pb 预分配数组，多余 slot 为 undefined；id 也是 SDK 内部对象需 String() 转换
      const defs = l2d.getParams()
        .map(p => ({ ...p, id: String(p.id) }))
        .filter(p => p.id && p.id !== 'undefined')
      setParams(defs)
      // 同步初始 value 到 paramValuesAtom
      const initValues: Record<string, number> = {}
      for (const p of defs) initValues[p.id] = p.value
      setParamValues(initValues)
    })
    l2d.on('motionstart', (group, index, duration) => {
      setMotionStartTimestamp(performance.now())   // 事件触发瞬间记录，最接近实际起始时间
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
  }, [
    l2d,
    setStatus, setProgress, setExpressions, setMotions,
    setParams, setParamValues,
    setActiveMotion, setMotionDuration, setMotionProgress, setMotionStartTimestamp,
    setActiveExpression,
  ])
}
