import { Layout } from 'antd'
import PanelCard from '@/components/shared/PanelCard'
import TransformControls from '@/components/controls/TransformControls'
import ResetButton from '@/components/controls/ResetButton'
import CodePreview from '@/components/controls/CodePreview'
import ExpressionPanel from '@/components/panels/ExpressionPanel'
import MotionPanel from '@/components/panels/MotionPanel'
import ParamPanel from '@/components/panels/ParamPanel'
import HitAreaPanel from '@/components/panels/HitAreaPanel'

const { Sider } = Layout

export default function Sidebar() {
  return (
    <Sider
      width={280}
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
      <PanelCard title="表情" defaultOpen>
        <ExpressionPanel />
      </PanelCard>
      <PanelCard title="动作" defaultOpen>
        <MotionPanel />
      </PanelCard>
      <PanelCard title="参数" defaultOpen={false}>
        <ParamPanel />
      </PanelCard>
      <PanelCard title="Hit Area" defaultOpen={false}>
        <HitAreaPanel />
      </PanelCard>
    </Sider>
  )
}
