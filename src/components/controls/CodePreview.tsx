import { Button, message, Typography } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useAtomValue } from 'jotai'
import { loadOptionsCodeAtom } from '@/atoms/viewer'

const { Text } = Typography

export default function CodePreview() {
  const code = useAtomValue(loadOptionsCodeAtom)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      void message.success('已复制到剪贴板')
    })
  }

  return (
    <div style={{ padding: '8px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>代码预览</Text>
        <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>复制</Button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '8px',
          borderRadius: 4,
          fontSize: 12,
          overflow: 'auto',
          background: 'rgba(0,0,0,0.2)',
          fontFamily: 'monospace',
        }}
      >
        {code}
      </pre>
    </div>
  )
}
