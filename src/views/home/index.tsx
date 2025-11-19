import { Card, Grid, List } from 'antd-mobile'
import {
  AppOutline,
  UserOutline,
  FileOutline,
  UnorderedListOutline,
} from 'antd-mobile-icons'
import { useRouter } from '@/hooks'
import { TabBar } from '@/components'
import './index.scss'

/**
 * 首页
 * 
 * 展示项目的主要功能和示例入口
 */
export default function HomePage() {
  const { push } = useRouter()

  // 底部导航配置
  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/examples/hooks-demo',
      title: 'Hooks',
      icon: <FileOutline />,
    },
    {
      key: '/examples/popup-demo',
      title: '弹窗',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/test/login',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  // 功能模块
  const features = [
    {
      title: '列表页面',
      desc: '下拉刷新、上拉加载',
      icon: '📋',
      path: '/examples/list',
    },
    {
      title: '详情页面',
      desc: '内容详情展示',
      icon: '📄',
      path: '/examples/detail',
    },
    {
      title: '表单页面',
      desc: '表单提交示例',
      icon: '📝',
      path: '/examples/form',
    },
    {
      title: 'Hooks演示',
      desc: '移动端专用Hooks',
      icon: '🎣',
      path: '/examples/hooks-demo',
    },
    {
      title: '弹窗演示',
      desc: '弹窗管理系统',
      icon: '🎭',
      path: '/examples/popup-demo',
    },
    {
      title: 'API请求',
      desc: '请求封装示例',
      icon: '🔌',
      path: '/test/count',
    },
  ]

  return (
    <div className="home-page">
      {/* 顶部横幅 */}
      <div className="home-banner">
        <h1 className="banner-title">React Mobile Template</h1>
        <p className="banner-desc">基于 React 19 + Vite 7 的移动端模板</p>
        <div className="banner-tags">
          <span className="tag">React 19</span>
          <span className="tag">Vite 7</span>
          <span className="tag">TypeScript</span>
          <span className="tag">Ant Design Mobile</span>
        </div>
      </div>

      {/* 技术栈 */}
      <Card title="✨ 核心技术栈" className="home-card">
        <List>
          <List.Item description="最新版本">React 19.1.1</List.Item>
          <List.Item description="极速构建">Vite 7.0.6</List.Item>
          <List.Item description="类型安全">TypeScript 5.9</List.Item>
          <List.Item description="移动端UI">Ant Design Mobile</List.Item>
          <List.Item description="状态管理">Zustand 5.0</List.Item>
          <List.Item description="路由管理">React Router 7.7</List.Item>
        </List>
      </Card>

      {/* 功能模块 */}
      <Card title="🎯 功能示例" className="home-card">
        <Grid columns={2} gap={16}>
          {features.map((item) => (
            <Grid.Item key={item.path}>
              <div className="feature-item" onClick={() => push(item.path)}>
                <div className="feature-icon">{item.icon}</div>
                <div className="feature-title">{item.title}</div>
                <div className="feature-desc">{item.desc}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </Card>

      {/* 特色功能 */}
      <Card title="🚀 特色功能" className="home-card">
        <List>
          <List.Item description="自动转换px为rem">移动端适配</List.Item>
          <List.Item description="Token、Loading、错误处理">API请求封装</List.Item>
          <List.Item description="集中管理弹窗状态">弹窗管理</List.Item>
          <List.Item description="持久化、DevTools">状态管理</List.Item>
          <List.Item description="触摸、滚动、视口等">移动端Hooks</List.Item>
          <List.Item description="设备判断、存储、验证">工具函数</List.Item>
        </List>
      </Card>

      {/* 占位符：为底部导航预留空间 */}
      <div className="tab-bar-placeholder with-safe-area" />

      {/* 底部导航 */}
      <TabBar items={tabs} fixed safeArea />
    </div>
  )
}
