import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { useSetAtom } from 'jotai'
import { modelUrlAtom } from '@/atoms/model'
import AppLayout from '@/components/layout/AppLayout'
import CanvasStage from '@/components/canvas/CanvasStage'

export default function ViewerPage() {
  const [searchParams] = useSearchParams()
  const setModelUrl = useSetAtom(modelUrlAtom)

  useEffect(() => {
    const model = searchParams.get('model')
    if (model) {
      setModelUrl(model)
    }
  }, [searchParams, setModelUrl])

  return (
    <AppLayout>
      <CanvasStage />
    </AppLayout>
  )
}
