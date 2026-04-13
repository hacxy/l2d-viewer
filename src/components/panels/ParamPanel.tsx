import { InputNumber, Button, Divider, Typography } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { paramsAtom, loadingStatusAtom } from '@/atoms/model'
import { getL2DInstance } from '@/lib/l2dSingleton'
import EmptyState from '@/components/shared/EmptyState'

const { Text } = Typography

const COMMON_PARAMS = [
  'ParamAngleX', 'ParamAngleY', 'ParamAngleZ',
  'ParamEyeLOpen', 'ParamEyeROpen',
  'ParamMouthOpenY', 'ParamBodyAngleX',
]

export default function ParamPanel() {
  const [params, setParams] = useAtom(paramsAtom)
  const status = useAtomValue(loadingStatusAtom)

  if (status !== 'loaded') return <EmptyState />

  const handleChange = (key: string, val: number | null) => {
    if (val === null) return
    const next = { ...params, [key]: val }
    setParams(next)
    getL2DInstance()?.setParams({ [key]: val })
  }

  return (
    <div style={{ padding: '8px 16px' }}>
      <Text type="secondary" style={{ fontSize: 11 }}>注：l2d 无 getParams()，仅支持写入</Text>
      <Divider style={{ margin: '8px 0' }} />
      {COMMON_PARAMS.map((key) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 12, flex: 1 }}>{key}</Text>
          <InputNumber
            size="small"
            value={params[key] ?? 0}
            step={0.1}
            min={-10}
            max={10}
            onChange={(val) => handleChange(key, val)}
            style={{ width: 80 }}
          />
        </div>
      ))}
      <Button size="small" block onClick={() => setParams({})} style={{ marginTop: 8 }}>
        重置参数
      </Button>
    </div>
  )
}
