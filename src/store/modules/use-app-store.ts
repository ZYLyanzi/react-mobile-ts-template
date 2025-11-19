import { createPersistedStore } from '../create-store'

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'auto'

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'en-US'

/**
 * 应用全局状态
 */
interface AppStore {
  /** 主题 */
  theme: Theme
  /** 语言 */
  language: Language
  /** 应用标题 */
  appTitle: string
  /** 是否首次访问 */
  isFirstVisit: boolean

  /** 设置主题 */
  setTheme: (theme: Theme) => void
  /** 设置语言 */
  setLanguage: (language: Language) => void
  /** 设置应用标题 */
  setAppTitle: (title: string) => void
  /** 标记已访问 */
  markVisited: () => void
  /** 重置应用状态 */
  reset: () => void
}

/**
 * 初始状态
 */
const initialState = {
  theme: 'light' as Theme,
  language: 'zh-CN' as Language,
  appTitle: 'React Mobile App',
  isFirstVisit: true,
}

/**
 * 应用全局状态管理
 * 
 * 用于管理应用级别的全局状态，如主题、语言等
 * 自动持久化到 localStorage
 * 
 * @example
 * ```typescript
 * const { theme, setTheme } = useAppStore()
 * 
 * // 切换主题
 * setTheme('dark')
 * ```
 */
export const useAppStore = createPersistedStore<AppStore>(
  (set) => ({
    ...initialState,

    setTheme: (theme) => set({ theme }),

    setLanguage: (language) => set({ language }),

    setAppTitle: (appTitle) => set({ appTitle }),

    markVisited: () => set({ isFirstVisit: false }),

    reset: () => set(initialState),
  }),
  {
    name: 'app-store',
    // 默认持久化所有状态
    // 如果需要部分持久化，可以使用 partialize
  },
)
