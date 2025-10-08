import { ref } from 'vue'

export const useTheme = () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    
    if (isDark.value) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    
  }
  
  // 初始化
  const initTheme = () => {
    if (isDark.value) document.documentElement.classList.add('dark')
  }
  
  return {
    isDark,
    toggleTheme,
    initTheme
  }
}