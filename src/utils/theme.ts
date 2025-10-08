export interface ThemeConfig {
  primaryColor: string
  borderRadius: number
  algorithm?: 'default' | 'dark'
}

export const lightTheme: ThemeConfig = {
  primaryColor: '#1890ff',
  borderRadius: 6,
  algorithm: 'default'
}

export const darkTheme: ThemeConfig = {
  primaryColor: '#177ddc',
  borderRadius: 6,
  algorithm: 'dark'
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: {
    primaryColor: '#1890ff',
    borderRadius: 8
  },
  green: {
    primaryColor: '#52c41a', 
    borderRadius: 12
  }
}