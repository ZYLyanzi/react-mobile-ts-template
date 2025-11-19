import { FC, ReactNode } from 'react'
import { NavBar as AntdNavBar } from 'antd-mobile'
import { useRouter } from '@/hooks'
import { SafeArea } from '../safe-area'
import './index.scss'

/**
 * NavBar 组件属性
 */
interface NavBarProps {
  /** 标题 */
  title?: ReactNode
  /** 左侧内容 */
  left?: ReactNode
  /** 右侧内容 */
  right?: ReactNode
  /** 返回箭头点击事件 */
  onBack?: () => void
  /** 是否显示返回箭头 */
  showBack?: boolean
  /** 是否固定定位 */
  fixed?: boolean
  /** 是否添加安全区域 */
  safeArea?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 导航栏组件
 *
 * 基于 antd-mobile NavBar 封装，增加移动端优化
 *
 * @example
 * ```tsx
 * // 基础用法
 * <NavBar title="页面标题" />
 *
 * // 带返回按钮
 * <NavBar title="详情" showBack />
 *
 * // 自定义左右内容
 * <NavBar
 *   title="我的"
 *   right={<button>设置</button>}
 * />
 *
 * // 固定定位 + 安全区域
 * <NavBar title="首页" fixed safeArea />
 * ```
 */
export const NavBar: FC<NavBarProps> = ({
  title,
  left,
  right,
  onBack,
  showBack = true,
  fixed = false,
  safeArea = true,
  className = '',
}) => {
  const { back } = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      back()
    }
  }

  const navBar = (
    <AntdNavBar
      className={`custom-nav-bar ${fixed ? 'custom-nav-bar--fixed' : ''} ${className}`}
      {...(showBack ? { onBack: handleBack } : {})}
      left={left}
      right={right}
    >
      {title}
    </AntdNavBar>
  )

  // 固定定位时添加安全区域
  if (fixed && safeArea) {
    return (
      <SafeArea position="top" className="nav-bar-wrapper">
        {navBar}
      </SafeArea>
    )
  }

  return navBar
}

export default NavBar

