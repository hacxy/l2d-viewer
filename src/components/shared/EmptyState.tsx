import { Empty } from 'antd'

interface Props {
  description?: string
}

export default function EmptyState({ description = '请先加载模型' }: Props) {
  return (
    <div style={{ padding: '24px 0' }}>
      <Empty description={description} styles={{ image: { height: 40 } }} />
    </div>
  )
}
