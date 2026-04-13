import { Layout } from 'antd'
import type { ReactNode } from 'react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

const { Header, Content } = Layout

interface Props {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          padding: 0,
          height: 56,
          lineHeight: '56px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TopBar />
      </Header>
      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        <Content style={{ overflow: 'hidden', position: 'relative' }}>
          {children}
        </Content>
        <Sidebar />
      </Layout>
    </Layout>
  )
}
