import { Button } from 'antd'
import { BulbOutlined, BulbFilled, GithubOutlined, BookOutlined } from '@ant-design/icons'
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
      <Button
        type="text"
        icon={<GithubOutlined />}
        href="https://github.com/hacxy/l2d-viewer"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
      />
      <Button
        type="text"
        icon={<BookOutlined />}
        href="https://l2d.hacxy.cn"
        target="_blank"
        rel="noopener noreferrer"
        title="l2d 官方文档"
      />
    </div>
  )
}
