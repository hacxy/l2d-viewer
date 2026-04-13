import { Button, List, Tag } from 'antd'
import { useAtomValue } from 'jotai'
import { expressionsAtom } from '@/atoms/model'
import { activeExpressionAtom } from '@/atoms/expressions'
import { loadingStatusAtom } from '@/atoms/model'
import { getL2DInstance } from '@/lib/l2dSingleton'
import EmptyState from '@/components/shared/EmptyState'

export default function ExpressionPanel() {
  const expressions = useAtomValue(expressionsAtom)
  const activeExpression = useAtomValue(activeExpressionAtom)
  const status = useAtomValue(loadingStatusAtom)

  if (status !== 'loaded') return <EmptyState />

  return (
    <div>
      <div style={{ padding: '4px 16px 8px' }}>
        <Button size="small" onClick={() => getL2DInstance()?.setExpression()}>
          随机
        </Button>
      </div>
      <List
        size="small"
        dataSource={expressions}
        renderItem={(id) => (
          <List.Item
            style={{ cursor: 'pointer', padding: '4px 16px' }}
            onClick={() => getL2DInstance()?.setExpression(id)}
          >
            {activeExpression === id ? (
              <Tag color="green">{id}</Tag>
            ) : (
              <span>{id}</span>
            )}
          </List.Item>
        )}
      />
    </div>
  )
}
