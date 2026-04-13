import { Collapse } from 'antd'
import { useState, useEffect } from 'react'
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

  const groups = Object.entries(motions)
  const [openKeys, setOpenKeys] = useState<string[]>(() => groups.map(([g]) => g))

  // 有动作播放时，确保其所在分组展开
  useEffect(() => {
    if (!activeMotion) return
    setOpenKeys((prev) =>
      prev.includes(activeMotion.group) ? prev : [...prev, activeMotion.group]
    )
  }, [activeMotion?.group])

  useMotionProgress()

  if (status !== 'loaded') return <EmptyState />

  const pct = Math.min(progress * 100, 100)

  return (
    <Collapse
      size="small"
      bordered={false}
      activeKey={openKeys}
      onChange={(keys) => setOpenKeys(keys as string[])}
      items={groups.map(([group, files]) => ({
        key: group,
        label: group,
        children: (
          <div>
            {files.map((file, index) => {
              const isActive = activeMotion?.group === group && activeMotion?.index === index
              return (
                <div
                  key={index}
                  onClick={() => getL2DInstance()?.playMotion(group, index)}
                  style={{
                    cursor: 'pointer',
                    padding: '5px 12px',
                    fontSize: 12,
                    position: 'relative',
                    overflow: 'hidden',
                    background: isActive
                      ? `linear-gradient(to right, rgba(0,255,128,0.22) ${pct}%, transparent ${pct}%)`
                      : 'transparent',
                    color: isActive ? 'rgba(0,255,128,0.95)' : undefined,
                    fontWeight: isActive ? 600 : undefined,
                    borderRadius: 4,
                    transition: 'color 0.15s',
                  }}
                >
                  {file.split('/').pop()}
                </div>
              )
            })}
          </div>
        ),
      }))}
    />
  )
}
