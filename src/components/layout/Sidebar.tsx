import { Layout } from 'antd'
import PanelCard from '@/components/shared/PanelCard'
import TransformControls from '@/components/controls/TransformControls'
import ResetButton from '@/components/controls/ResetButton'
import CodePreview from '@/components/controls/CodePreview'

const { Sider } = Layout

export default function Sidebar() {
  return (
    <Sider
      width={260}
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        borderLeft: '1px solid rgba(128,128,128,0.2)',
      }}
    >
      <PanelCard title="变换控制" defaultOpen>
        <TransformControls />
        <ResetButton />
        <CodePreview />
      </PanelCard>
    </Sider>
  )
}
