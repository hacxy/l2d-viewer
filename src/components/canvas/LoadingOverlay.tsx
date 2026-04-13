import { useAtomValue } from 'jotai'
import { Progress } from 'antd'
import { loadingStatusAtom, loadProgressAtom } from '@/atoms/model'

export default function LoadingOverlay() {
  const status = useAtomValue(loadingStatusAtom)
  const progress = useAtomValue(loadProgressAtom)

  if (status !== 'loading') return null

  const percent = progress.total > 0
    ? Math.round((progress.loaded / progress.total) * 100)
    : 0

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Progress
        type="circle"
        percent={percent}
        size={80}
        strokeColor="#00ff80"
      />
    </div>
  )
}
