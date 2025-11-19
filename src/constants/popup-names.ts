/**
 * 弹窗名称枚举
 * 
 * 使用枚举统一管理所有弹窗名称，避免字符串拼写错误
 * 
 * @example
 * ```typescript
 * import { PopupNames } from '@/constants'
 * 
 * // 在组件中使用
 * const { popShow } = usePopup()
 * popShow(PopupNames.DEMO)
 * ```
 */
export enum PopupNames {
  /** 示例弹窗 */
  DEMO = 'DEMO',
  /** 确认弹窗 */
  CONFIRM = 'CONFIRM',
  /** 选择器弹窗 */
  PICKER = 'PICKER',
  // 在这里添加更多弹窗...
}

/** 弹窗名称类型 */
export type PopupName = `${PopupNames}`

