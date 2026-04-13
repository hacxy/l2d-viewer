import { Collapse } from 'antd'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { motionsAtom, loadingStatusAtom } from '@/atoms/model'
import { activeMotionAtom, motionProgressAtom } from '@/atoms/motions'
import { getL2DInstance } from '@/lib/l2dSingleton'
import { useMotionProgress } from '@/hooks/useMotionProgress'
import EmptyState from '@/components/shared/EmptyState'

const CLICK_MOTION_PRIORITY = 3

export default function MotionPanel() {
  const motions = useAtomValue(motionsAtom)
  const activeMotion = useAtomValue(activeMotionAtom)
  const progress = useAtomValue(motionProgressAtom)
  const status = useAtomValue(loadingStatusAtom)

  const groups = Object.entries(motions)

  // 用户手动折叠/展开的状态
  const [userOpenKeys, setUserOpenKeys] = useState<string[]>(() => groups.map(([g]) => g))

  // 派生：有动作播放时，确保其分组始终展开，避免在 effect 中 setState
  const openKeys =
    activeMotion?.group && !userOpenKeys.includes(activeMotion.group)
      ? [...userOpenKeys, activeMotion.group]
      : userOpenKeys

  useMotionProgress()

  if (status !== 'loaded') return <EmptyState />

  const pct = Math.min(progress * 100, 100)

  return (
    <Collapse
      size="small"
      bordered={false}
      activeKey={openKeys}
      onChange={(keys) => setUserOpenKeys(keys as string[])}
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
                  onClick={() => getL2DInstance()?.playMotion(group, index, CLICK_MOTION_PRIORITY)}
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
