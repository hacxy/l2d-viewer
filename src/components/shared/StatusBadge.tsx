import { Badge, Spin } from 'antd'
import { useAtomValue } from 'jotai'
import { loadingStatusAtom, loadingErrorAtom } from '@/atoms/model'

const statusConfig = {
  idle: { status: 'default' as const, text: 'idle' },
  loading: { status: 'processing' as const, text: 'loading' },
  loaded: { status: 'success' as const, text: 'loaded' },
  error: { status: 'error' as const, text: 'error' },
}

export default function StatusBadge() {
  const status = useAtomValue(loadingStatusAtom)
  const error = useAtomValue(loadingErrorAtom)
  const config = statusConfig[status]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
      {status === 'loading' ? (
        <Spin size="small" />
      ) : (
        <Badge status={config.status} text={error ? error.slice(0, 30) : config.text} />
      )}
    </div>
  )
}
