import { Button } from 'antd'
import { useSetAtom } from 'jotai'
import { posXAtom, posYAtom, scaleAtom } from '@/atoms/viewer'
import { getL2DInstance } from '@/lib/l2dSingleton'

export default function ResetButton() {
  const setPosX = useSetAtom(posXAtom)
  const setPosY = useSetAtom(posYAtom)
  const setScale = useSetAtom(scaleAtom)

  const handleReset = () => {
    setPosX(0)
    setPosY(0)
    setScale(1)
    const l2d = getL2DInstance()
    l2d?.setPosition(0, 0)
    l2d?.setScale(1)
  }

  return (
    <Button block onClick={handleReset} style={{ marginTop: 8 }}>
      重置
    </Button>
  )
}
