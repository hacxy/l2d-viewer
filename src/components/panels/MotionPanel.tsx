import { Collapse, List, Progress, Tag } from 'antd'
import { useAtomValue } from 'jotai'
import { motionsAtom, loadingStatusAtom } from '@/atoms/model'
import { activeMotionAtom, motionProgressAtom } from '@/atoms/motions'
import { getL2DInstance } from '@/lib/l2dSingleton'
import { useMotionProgress } from '@/hooks/useMotionProgress'
import EmptyState from '@/components/shared/EmptyState'

export default function MotionPanel() {
  const motions = useAtomValue(motionsAtom)
  const activeMotion = useAtomValue(activeMotionAtom)
  const progress = useAtomValue(motionProgressAtom)
  const status = useAtomValue(loadingStatusAtom)

  useMotionProgress()

  if (status !== 'loaded') return <EmptyState />

  const groups = Object.entries(motions)

  return (
    <div>
      {activeMotion && (
        <div style={{ padding: '4px 16px 8px' }}>
          <Progress percent={Math.round(progress * 100)} size="small" showInfo={false} />
        </div>
      )}
      <Collapse
        size="small"
        bordered={false}
        items={groups.map(([group, files]) => ({
          key: group,
          label: group,
          children: (
            <List
              size="small"
              dataSource={files}
              renderItem={(file, index) => {
                const isActive = activeMotion?.group === group && activeMotion?.index === index
                return (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '4px 8px' }}
                    onClick={() => getL2DInstance()?.playMotion(group, index)}
                  >
                    {isActive ? (
                      <Tag color="green">{file.split('/').pop()}</Tag>
                    ) : (
                      <span style={{ fontSize: 12 }}>{file.split('/').pop()}</span>
                    )}
                  </List.Item>
                )
              }}
            />
          ),
        }))}
      />
    </div>
  )
}
