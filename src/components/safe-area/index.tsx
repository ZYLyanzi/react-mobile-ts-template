import { FC, ReactNode } from 'react'
import { useSafeArea } from '@/hooks'
import './index.scss'

/**
 * 安全区域组件属性
 */
interface SafeAreaProps {
  /** 子元素 */
  children?: ReactNode
  /** 应用的位置 */
  position?: 'top' | 'bottom' | 'both'
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * 安全区域组件
 * 
 * 用于适配刘海屏、圆角屏等，自动添加安全区域内边距
 * 
 * @example
 * ```tsx
 * // 顶部安全区域
 * <SafeArea position="top">
 *   <Header />
 * </SafeArea>
 * 
 * // 底部安全区域
 * <SafeArea position="bottom">
 *   <Footer />
 * </SafeArea>
 * 
 * // 上下都添加
 * <SafeArea position="both">
 *   <Content />
 * </SafeArea>
 * ```
 */
export const SafeArea: FC<SafeAreaProps> = ({
  children,
  position = 'bottom',
  className = '',
  style,
}) => {
  const safeArea = useSafeArea()

  const getPaddingStyle = () => {
    const paddingStyle: React.CSSProperties = {}

    if (position === 'top' || position === 'both') {
      paddingStyle.paddingTop = `${safeArea.top}px`
    }

    if (position === 'bottom' || position === 'both') {
      paddingStyle.paddingBottom = `${safeArea.bottom}px`
    }

    return paddingStyle
  }

  return (
    <div
      className={`safe-area safe-area--${position} ${className}`}
      style={{ ...getPaddingStyle(), ...style }}
    >
      {children}
    </div>
  )
}

export default SafeArea

