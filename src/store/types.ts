/**
 * Store 相关类型定义
 */

/**
 * Store 基础状态接口
 */
export interface BaseStore {
  /** 重置状态 */
  reset?: () => void
}

/**
 * 持久化状态标记
 */
export interface PersistedState {
  /** 是否已持久化 */
  _hasHydrated?: boolean
}

