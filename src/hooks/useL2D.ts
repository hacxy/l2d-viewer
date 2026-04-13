import { useEffect, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { init } from 'l2d'
import type { L2D } from 'l2d'
import { modelUrlAtom, loadingStatusAtom, loadingErrorAtom } from '@/atoms/model'
import { posXAtom, posYAtom, scaleAtom } from '@/atoms/viewer'
import { setL2DInstance } from '@/lib/l2dSingleton'
import { useModelEvents } from './useModelEvents'

export function useL2D(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [l2d, setL2D] = useState<L2D | null>(null)
  const l2dRef = useRef<L2D | null>(null)
  const modelUrl = useAtomValue(modelUrlAtom)
  const posX = useAtomValue(posXAtom)
  const posY = useAtomValue(posYAtom)
  const scale = useAtomValue(scaleAtom)
  const setStatus = useSetAtom(loadingStatusAtom)
  const setError = useSetAtom(loadingErrorAtom)

  useModelEvents(l2d)

  useEffect(() => {
    if (!canvasRef.current) return
    const instance = init(canvasRef.current)
    l2dRef.current = instance
    setL2DInstance(instance)
    setL2D(instance)
    return () => {
      instance.destroy()
      setL2DInstance(null)
      l2dRef.current = null
      setL2D(null)
    }
  }, [])

  useEffect(() => {
    if (!modelUrl || !l2dRef.current) return
    setStatus('loading')
    setError(null)
    l2dRef.current
      .load({ path: modelUrl, position: [posX, posY], scale })
      .catch((err: Error) => {
        setStatus('error')
        setError(err.message)
      })
  }, [modelUrl])

  return l2dRef
}
