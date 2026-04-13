import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router'
import { useAtomValue } from 'jotai'
import { router } from '@/router'
import { themeAtom } from '@/atoms/viewer'
import { lightThemeConfig, darkThemeConfig } from '@/styles/theme'

export default function App() {
  const theme = useAtomValue(themeAtom)

  return (
    <ConfigProvider theme={theme === 'dark' ? darkThemeConfig : lightThemeConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
