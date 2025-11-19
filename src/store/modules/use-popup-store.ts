import { create } from 'zustand'
import type { PopupNames } from '@/constants'

/**
 * 弹窗项
 */
export interface PopupItem {
  /** 显示状态 */
  show: boolean
  /** 设置显示状态的方法 */
  setShow: (show: boolean) => void
}

/**
 * 弹窗 Store 状态
 */
interface PopupStore {
  /** 弹窗列表（使用 Map 存储） */
  list: Map<PopupNames, PopupItem>
  /** 注册弹窗 */
  setPopup: (key: PopupNames, item: PopupItem) => void
  /** 移除弹窗 */
  removePopup: (key: PopupNames) => void
  /** 清空所有弹窗 */
  clear: () => void
}

/**
 * 弹窗状态管理 Store
 * 
 * 特性：
 * - 集中管理所有弹窗状态
 * - 支持弹窗注册/移除
 * - 配合 usePopup Hook 使用
 * 
 * @example
 * ```typescript
 * // 在弹窗组件中注册
 * const [visible, setVisible] = useState(false)
 * const { setPopup, removePopup } = usePopupStore()
 * 
 * useEffect(() => {
 *   setPopup(PopupNames.DEMO, { show: visible, setShow: setVisible })
 *   return () => removePopup(PopupNames.DEMO)
 * }, [visible])
 * 
 * // 在其他地方控制
 * const { popShow } = usePopup()
 * popShow(PopupNames.DEMO)
 * ```
 */
export const usePopupStore = create<PopupStore>((set, get) => ({
  list: new Map(),

  /**
   * 注册弹窗
   */
  setPopup: (key, item) => {
    const list = new Map(get().list)

    if (list.has(key)) {
      console.warn(`[PopupStore] 弹窗已注册: ${key}，将覆盖旧的状态`)
    }

    list.set(key, item)
    set({ list })
  },

  /**
   * 移除弹窗
   */
  removePopup: (key) => {
    const list = new Map(get().list)

    if (!list.has(key)) {
      console.warn(`[PopupStore] 弹窗未注册: ${key}`)
      return
    }

    list.delete(key)
    set({ list })
  },

  /**
   * 清空所有弹窗
   */
  clear: () => {
    set({ list: new Map() })
  },
}))
