import { Button, Tag } from 'antd'
import { useAtomValue } from 'jotai'
import { expressionsAtom, loadingStatusAtom } from '@/atoms/model'
import { activeExpressionAtom } from '@/atoms/expressions'
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
      <div>
        {expressions.map((id) => (
          <div
            key={id}
            onClick={() => getL2DInstance()?.setExpression(id)}
            style={{ cursor: 'pointer', padding: '4px 16px' }}
          >
            {activeExpression === id ? (
              <Tag color="green">{id}</Tag>
            ) : (
              <span style={{ fontSize: 14 }}>{id}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
