import { useState } from 'react'
import { Switch, Table, Typography, theme } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import { useAtom, useAtomValue } from 'jotai'
import { hitAreaBoundsAtom, loadingStatusAtom } from '@/atoms/model'
import { hitAreaOverlayEnabledAtom } from '@/atoms/viewer'

const { Text } = Typography

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: 'X', dataIndex: 'x', key: 'x', width: 80, render: (v: number) => v.toFixed(3) },
  { title: 'Y', dataIndex: 'y', key: 'y', width: 80, render: (v: number) => v.toFixed(3) },
  { title: 'W', dataIndex: 'w', key: 'w', width: 80, render: (v: number) => v.toFixed(3) },
  { title: 'H', dataIndex: 'h', key: 'h', width: 80, render: (v: number) => v.toFixed(3) },
]

export default function BottomPanel() {
  const [expanded, setExpanded] = useState(false)
  const [overlayEnabled, setOverlayEnabled] = useAtom(hitAreaOverlayEnabledAtom)
  const bounds = useAtomValue(hitAreaBoundsAtom)
  const status = useAtomValue(loadingStatusAtom)
  const { token } = theme.useToken()

  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
      }}
    >
      {/* 始终可见的标题栏 */}
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 16px',
          height: 36,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <CaretRightOutlined
          style={{
            fontSize: 10,
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            color: token.colorTextSecondary,
          }}
        />
        <Text style={{ fontSize: 13, fontWeight: 500 }}>Hit Areas</Text>
        {status === 'loaded' && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({bounds.length})
          </Text>
        )}
        {/* 覆盖层开关放在标题栏右侧，阻止点击冒泡以免触发折叠 */}
        <div
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>显示覆盖层</Text>
          <Switch
            size="small"
            checked={overlayEnabled}
            onChange={setOverlayEnabled}
            disabled={status !== 'loaded'}
          />
        </div>
      </div>

      {/* 可展开内容区 */}
      {expanded && (
        <div style={{ maxHeight: 180, overflowY: 'auto', padding: '0 16px 8px' }}>
          {status !== 'loaded' ? (
            <Text type="secondary" style={{ fontSize: 12 }}>请先加载模型</Text>
          ) : (
            <Table
              size="small"
              dataSource={bounds.map((b) => ({ ...b, key: b.name }))}
              columns={columns}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
        </div>
      )}
    </div>
  )
}
