import { Slider, Typography } from 'antd'
import { useAtom } from 'jotai'
import { posXAtom, posYAtom, scaleAtom } from '@/atoms/viewer'
import { getL2DInstance } from '@/lib/l2dSingleton'

const { Text } = Typography

export default function TransformControls() {
  const [posX, setPosX] = useAtom(posXAtom)
  const [posY, setPosY] = useAtom(posYAtom)
  const [scale, setScale] = useAtom(scaleAtom)

  const handlePosX = (val: number) => {
    setPosX(val)
    getL2DInstance()?.setPosition(val, posY)
  }
  const handlePosY = (val: number) => {
    setPosY(val)
    getL2DInstance()?.setPosition(posX, val)
  }
  const handleScale = (val: number) => {
    setScale(val)
    getL2DInstance()?.setScale(val)
  }

  return (
    <div style={{ padding: '8px 16px' }}>
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>X: {posX.toFixed(2)}</Text>
        <Slider
          min={-2} max={2} step={0.01}
          value={posX} onChange={handlePosX}
          style={{ margin: '4px 0' }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Y: {posY.toFixed(2)}</Text>
        <Slider
          min={-2} max={2} step={0.01}
          value={posY} onChange={handlePosY}
          style={{ margin: '4px 0' }}
        />
      </div>
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}>Scale: {scale.toFixed(2)}</Text>
        <Slider
          min={0.1} max={5} step={0.01}
          value={scale} onChange={handleScale}
          style={{ margin: '4px 0' }}
        />
      </div>
    </div>
  )
}
