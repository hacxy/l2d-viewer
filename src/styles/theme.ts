import type { ThemeConfig } from 'antd'
import { theme as antdTheme } from 'antd'

export const lightThemeConfig: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorBgBase: '#ffffff',
    colorTextBase: '#000000',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },
  },
}

export const darkThemeConfig: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorBgBase: '#141414',
    colorTextBase: '#ffffff',
  },
  components: {
    Layout: {
      headerBg: '#1f1f1f',
      siderBg: '#1f1f1f',
      bodyBg: '#000000',
    },
  },
}
