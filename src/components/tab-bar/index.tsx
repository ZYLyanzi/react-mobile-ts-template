import { FC, ReactNode } from 'react'
import { TabBar as AntdTabBar } from 'antd-mobile'
import { useRouter } from '@/hooks'
import { SafeArea } from '../safe-area'
import './index.scss'

/**
 * TabBar 配置项
 */
export interface TabBarItem {
  /** 唯一key */
  key: string
  /** 标题 */
  title: string
  /** 图标 */
  icon?: ReactNode
  /** 激活图标 */
  activeIcon?: ReactNode
  /** 徽标 */
  badge?: string | number
}

/**
 * TabBar 组件属性
 */
interface TabBarProps {
  /** 标签配置 */
  items: TabBarItem[]
  /** 默认激活的key */
  defaultActiveKey?: string
  /** 切换回调 */
  onChange?: (key: string) => void
  /** 是否固定定位 */
  fixed?: boolean
  /** 是否添加安全区域 */
  safeArea?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 底部导航栏组件
 *
 * 基于 antd-mobile TabBar 封装，增加安全区域等移动端优化
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { key: '/home', title: '首页', icon: <HomeOutline /> },
 *   { key: '/user', title: '我的', icon: <UserOutline /> },
 * ]
 *
 * <TabBar items={tabs} fixed safeArea />
 * ```
 */
export const TabBar: FC<TabBarProps> = ({
  items,
  defaultActiveKey,
  onChange,
  fixed = true,
  safeArea = true,
  className = '',
}) => {
  const { push } = useRouter()
  const pathname = window.location.pathname
  const activeKey = pathname || defaultActiveKey || items[0]?.key

  const handleChange = (key: string) => {
    if (onChange) {
      onChange(key)
    } else {
      // 默认行为：路由跳转
      push(key)
    }
  }

  const tabBar = (
    <AntdTabBar
      className={`custom-tab-bar ${fixed ? 'custom-tab-bar--fixed' : ''} ${className}`}
      activeKey={activeKey}
      onChange={handleChange}
    >
      {items.map((item) => (
        <AntdTabBar.Item
          key={item.key}
          icon={item.icon}
          title={item.title}
          badge={item.badge}
        />
      ))}
    </AntdTabBar>
  )

  // 固定定位时添加安全区域
  if (fixed && safeArea) {
    return (
      <SafeArea position="bottom" className="tab-bar-wrapper">
        {tabBar}
      </SafeArea>
    )
  }

  return tabBar
}

export default TabBar

