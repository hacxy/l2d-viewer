import { Switch, Table, Typography } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { hitAreaBoundsAtom, loadingStatusAtom } from '@/atoms/model'
import { hitAreaOverlayEnabledAtom } from '@/atoms/viewer'
import EmptyState from '@/components/shared/EmptyState'

const { Text } = Typography

export default function HitAreaPanel() {
  const bounds = useAtomValue(hitAreaBoundsAtom)
  const [overlayEnabled, setOverlayEnabled] = useAtom(hitAreaOverlayEnabledAtom)
  const status = useAtomValue(loadingStatusAtom)

  if (status !== 'loaded') return <EmptyState />

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: 'X', dataIndex: 'x', key: 'x', render: (v: number) => v.toFixed(3) },
    { title: 'Y', dataIndex: 'y', key: 'y', render: (v: number) => v.toFixed(3) },
    { title: 'W', dataIndex: 'w', key: 'w', render: (v: number) => v.toFixed(3) },
    { title: 'H', dataIndex: 'h', key: 'h', render: (v: number) => v.toFixed(3) },
  ]

  return (
    <div style={{ padding: '8px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Text style={{ fontSize: 12 }}>显示覆盖层</Text>
        <Switch
          size="small"
          checked={overlayEnabled}
          onChange={setOverlayEnabled}
        />
      </div>
      <Table
        size="small"
        dataSource={bounds.map((b) => ({ ...b, key: b.name }))}
        columns={columns}
        pagination={false}
      />
    </div>
  )
}
