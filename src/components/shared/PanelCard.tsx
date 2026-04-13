import { Collapse } from 'antd'
import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function PanelCard({ title, children, defaultOpen = true }: Props) {
  return (
    <Collapse
      defaultActiveKey={defaultOpen ? ['panel'] : []}
      style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid var(--border-color)' }}
      items={[
        {
          key: 'panel',
          label: title,
          children,
          style: { padding: 0 },
        },
      ]}
    />
  )
}
