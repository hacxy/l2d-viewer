import { Layout } from 'antd'
import PanelCard from '@/components/shared/PanelCard'
import ExpressionPanel from '@/components/panels/ExpressionPanel'
import MotionPanel from '@/components/panels/MotionPanel'
import ParamPanel from '@/components/panels/ParamPanel'

const { Sider } = Layout

export default function LeftSidebar() {
  return (
    <Sider
      width={300}
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        borderRight: '1px solid rgba(128,128,128,0.2)',
      }}
    >
      <PanelCard title="表情" defaultOpen={false}>
        <ExpressionPanel />
      </PanelCard>
      <PanelCard title="动作" defaultOpen>
        <MotionPanel />
      </PanelCard>
      <PanelCard title="参数" defaultOpen={false}>
        <ParamPanel />
      </PanelCard>
    </Sider>
  )
}
