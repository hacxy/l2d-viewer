import { Button } from 'antd'
import { BulbOutlined, BulbFilled } from '@ant-design/icons'
import { useAtom } from 'jotai'
import { themeAtom } from '@/atoms/viewer'
import UrlInputBar from '@/components/controls/UrlInputBar'
import StatusBadge from '@/components/shared/StatusBadge'

export default function TopBar() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: '100%',
      }}
    >
      <UrlInputBar />
      <StatusBadge />
      <Button
        type="text"
        icon={theme === 'dark' ? <BulbFilled /> : <BulbOutlined />}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title="切换主题"
      />
    </div>
  )
}
