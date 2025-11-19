import { create, StateCreator } from 'zustand'
import { persist, devtools, PersistOptions } from 'zustand/middleware'

/**
 * Store 配置选项
 */
interface StoreConfig<T> {
  /** Store 名称（用于 devtools 显示） */
  name: string
  /** 是否启用持久化 */
  persist?: boolean
  /** 持久化配置 */
  persistOptions?: Omit<PersistOptions<T>, 'name'>
  /** 是否启用 devtools（默认仅开发环境启用） */
  devtools?: boolean
}

/**
 * 创建 Store 的工具函数
 * 
 * 特性：
 * - 支持持久化（可选）
 * - 支持 devtools（开发环境默认启用）
 * - 类型安全
 * - 简化配置
 * 
 * @example
 * ```typescript
 * // 简单模式（无持久化）
 * export const useCountStore = createStore<CountStore>(
 *   (set) => ({
 *     count: 0,
 *     increment: () => set((state) => ({ count: state.count + 1 })),
 *   }),
 *   { name: 'count-store' }
 * )
 * 
 * // 高级模式（带持久化）
 * export const useUserStore = createStore<UserStore>(
 *   (set) => ({
 *     token: '',
 *     setToken: (token) => set({ token }),
 *   }),
 *   {
 *     name: 'user-store',
 *     persist: true,
 *     persistOptions: {
 *       partialize: (state) => ({ token: state.token }),
 *     },
 *   }
 * )
 * ```
 */
export function createStore<T>(
  stateCreator: StateCreator<T>,
  config: StoreConfig<T>,
) {
  const { name, persist: enablePersist, persistOptions, devtools: enableDevtools } = config

  // 应用 devtools 中间件（默认仅在开发环境启用）
  const shouldEnableDevtools = enableDevtools !== false && import.meta.env.DEV

  // 根据配置组合中间件
  if (enablePersist && shouldEnableDevtools) {
    // 同时启用持久化和devtools
    return create<T>()(
      devtools(
        persist(stateCreator, {
          name,
          ...persistOptions,
        }),
        { name },
      ),
    )
  } else if (enablePersist) {
    // 仅启用持久化
    return create<T>()(
      persist(stateCreator, {
        name,
        ...persistOptions,
      }),
    )
  } else if (shouldEnableDevtools) {
    // 仅启用devtools
    return create<T>()(devtools(stateCreator, { name }))
  } else {
    // 无中间件
    return create<T>()(stateCreator)
  }
}

/**
 * 简单创建 Store（无持久化）
 * 
 * @example
 * ```typescript
 * export const useCountStore = createSimpleStore<CountStore>(
 *   (set) => ({
 *     count: 0,
 *     increment: () => set((state) => ({ count: state.count + 1 })),
 *   }),
 *   'count-store'
 * )
 * ```
 */
export function createSimpleStore<T>(
  stateCreator: StateCreator<T>,
  name: string,
) {
  return createStore<T>(stateCreator, { name })
}

/**
 * 创建持久化 Store
 * 
 * @example
 * ```typescript
 * export const useUserStore = createPersistedStore<UserStore>(
 *   (set) => ({
 *     token: '',
 *     setToken: (token) => set({ token }),
 *   }),
 *   {
 *     name: 'user-store',
 *     storage: localStorage, // 可选，默认 localStorage
 *   }
 * )
 * ```
 */
export function createPersistedStore<T>(
  stateCreator: StateCreator<T>,
  config: {
    name: string
    persistOptions?: Omit<PersistOptions<T>, 'name'>
  },
) {
  const storeConfig: StoreConfig<T> = {
    name: config.name,
    persist: true,
  }

  if (config.persistOptions) {
    storeConfig.persistOptions = config.persistOptions
  }

  return createStore<T>(stateCreator, storeConfig)
}
