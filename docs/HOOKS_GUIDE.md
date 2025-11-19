# 🎣 Hooks 使用指南

## 移动端专用 Hooks

项目提供了5个移动端专用的 Hooks，帮助你更轻松地开发移动端应用。

### 1. useTouch - 触摸手势

处理触摸手势，支持上下左右滑动检测。

```tsx
import { useTouch } from '@/hooks'

function SwipeCard() {
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouch({
    onSwipeLeft: () => console.log('向左滑动'),
    onSwipeRight: () => console.log('向右滑动'),
    onSwipeUp: () => console.log('向上滑动'),
    onSwipeDown: () => console.log('向下滑动'),
    threshold: 50, // 滑动距离阈值
  })

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ width: '100%', height: '300px', background: '#f0f0f0' }}
    >
      滑动我试试
    </div>
  )
}
```

**应用场景：**
- 图片轮播
- 左滑删除
- 下拉刷新
- 卡片切换

### 2. useScroll - 滚动监听

监听滚动事件，支持到顶/到底检测。

```tsx
import { useScroll } from '@/hooks'

function InfiniteList() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const scrollInfo = useScroll({
    onReachBottom: async () => {
      if (loading) return
      
      setLoading(true)
      const newData = await fetchMoreData()
      setList([...list, ...newData])
      setLoading(false)
    },
    bottomOffset: 100, // 距离底部100px时触发
    throttle: 100, // 节流100ms
  })

  return (
    <div>
      <p>当前滚动位置: {scrollInfo.scrollY}px</p>
      <p>滚动方向: {scrollInfo.direction}</p>
      {list.map(item => <div key={item.id}>{item.name}</div>)}
      {loading && <div>加载中...</div>}
    </div>
  )
}

// 监听指定元素
function ScrollableDiv() {
  const listRef = useRef<HTMLDivElement>(null)
  
  const scrollInfo = useScroll({
    target: listRef.current,
    onReachTop: () => console.log('到顶了'),
  })

  return <div ref={listRef} style={{ height: '400px', overflow: 'auto' }}>
    {/* 内容 */}
  </div>
}
```

**应用场景：**
- 无限滚动加载
- 返回顶部按钮显示/隐藏
- 滚动吸顶
- 滚动动画

### 3. useViewport - 视口信息

获取并监听视口尺寸和方向变化。

```tsx
import { useViewport } from '@/hooks'

function ResponsiveComponent() {
  const { width, height, orientation } = useViewport()

  return (
    <div>
      <p>视口宽度: {width}px</p>
      <p>视口高度: {height}px</p>
      <p>屏幕方向: {orientation}</p>
      
      {orientation === 'landscape' && (
        <div>横屏模式</div>
      )}
    </div>
  )
}

// 根据屏幕宽度渲染不同组件
function AdaptiveLayout() {
  const { width } = useViewport()

  if (width < 375) {
    return <SmallScreenLayout />
  } else if (width < 768) {
    return <MobileLayout />
  } else {
    return <TabletLayout />
  }
}
```

**应用场景：**
- 横竖屏适配
- 响应式布局
- 根据屏幕尺寸加载不同资源

### 4. useSafeArea - 安全区域

获取设备安全区域，适配刘海屏、圆角等。

```tsx
import { useSafeArea } from '@/hooks'

function Header() {
  const safeArea = useSafeArea()

  return (
    <header
      style={{
        paddingTop: `${safeArea.top}px`, // 顶部避开刘海
        background: '#fff',
      }}
    >
      <h1>标题栏</h1>
    </header>
  )
}

// 使用 CSS 变量（更推荐）
function Footer() {
  useSafeArea() // 会设置 CSS 变量

  return (
    <footer
      style={{
        paddingBottom: 'var(--safe-area-bottom)', // 底部避开圆角
      }}
    >
      底部导航
    </footer>
  )
}

// 结合 Tailwind
function SafeAreaComponent() {
  useSafeArea()
  
  return (
    <div className="pt-[var(--safe-area-top)] pb-[var(--safe-area-bottom)]">
      内容
    </div>
  )
}
```

**应用场景：**
- 全面屏适配
- 固定定位元素
- 底部导航栏
- 顶部状态栏

### 5. useNetwork - 网络状态

监听网络状态变化，适配弱网环境。

```tsx
import { useNetwork } from '@/hooks'
import { Toast } from 'antd-mobile'

function MyComponent() {
  const network = useNetwork({
    onOffline: () => {
      Toast.show({ icon: 'fail', content: '网络已断开' })
    },
    onOnline: () => {
      Toast.show({ icon: 'success', content: '网络已连接' })
    },
  })

  // 离线提示
  if (!network.online) {
    return (
      <div className="offline-notice">
        <p>网络已断开，请检查网络连接</p>
      </div>
    )
  }

  // 根据网络类型调整资源质量
  const imageQuality = network.effectiveType === '4g' ? 'high' : 'low'

  return (
    <div>
      <p>网络类型: {network.effectiveType}</p>
      <img src={`/image-${imageQuality}.jpg`} alt="根据网络调整" />
    </div>
  )
}

// 弱网提示
function NetworkWarning() {
  const { effectiveType, saveData } = useNetwork()

  if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
    return (
      <div className="network-warning">
        网络较慢，已为您开启省流模式
      </div>
    )
  }

  return null
}
```

**应用场景：**
- 离线提示
- 弱网优化
- 根据网络调整资源质量
- 省流模式

## 业务 Hooks

### usePopup - 弹窗管理

详见 [弹窗管理使用指南](./POPUP_MANAGE_USAGE.md)

```tsx
import { usePopup } from '@/hooks'
import { PopupNames } from '@/constants'

const { popShow, popClose, popCloseAll } = usePopup()

// 打开弹窗
popShow(PopupNames.DEMO)

// 关闭所有弹窗
popCloseAll()
```

## 基础 Hooks

### useRouter - 路由操作

```tsx
import { useRouter } from '@/hooks'

function MyComponent() {
  const { push, replace, back, pathname, params } = useRouter()

  return (
    <>
      <button onClick={() => push('/home')}>跳转首页</button>
      <button onClick={() => back()}>返回</button>
      <p>当前路径: {pathname}</p>
    </>
  )
}
```

### useNamespace - BEM 命名

```tsx
import { useNamespace } from '@/hooks'

function MyComponent() {
  const { b, e, m, bem } = useNamespace('card')

  return (
    <div className={b()}>              {/* card */}
      <h3 className={e('title')}>      {/* card__title */}
        标题
      </h3>
      <p className={m('large')}>       {/* card--large */}
        内容
      </p>
      <div className={bem('footer', 'fixed')}>  {/* card__footer--fixed */}
        底部
      </div>
    </div>
  )
}
```

### useRefState - ref + state

```tsx
import { useRefState } from '@/hooks'

function MyComponent() {
  const [count, setCount, countRef] = useRefState(0)

  // state: 用于渲染
  // ref: 用于在回调中获取最新值

  const handleClick = () => {
    setTimeout(() => {
      console.log(countRef.current) // 总是最新值
    }, 1000)
  }

  return <div onClick={handleClick}>{count}</div>
}
```

## 组合使用

### 实战案例 1: 滑动切换卡片

```tsx
import { useTouch } from '@/hooks'
import { useState } from 'react'

function CardSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const cards = ['卡片1', '卡片2', '卡片3']

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouch({
    onSwipeLeft: () => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    },
    threshold: 50,
  })

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {cards[currentIndex]}
    </div>
  )
}
```

### 实战案例 2: 智能加载

```tsx
import { useScroll, useNetwork } from '@/hooks'
import { useState } from 'react'

function SmartList() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const network = useNetwork()

  // 根据网络状态调整加载策略
  const pageSize = network.effectiveType === '4g' ? 20 : 10

  useScroll({
    onReachBottom: async () => {
      if (!network.online) {
        Toast.show('网络已断开')
        return
      }

      const newData = await fetchData(page, pageSize)
      setList([...list, ...newData])
      setPage(page + 1)
    },
    bottomOffset: network.effectiveType === '4g' ? 200 : 50,
  })

  return (
    <div>
      {list.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

### 实战案例 3: 横竖屏适配

```tsx
import { useViewport, useSafeArea } from '@/hooks'

function VideoPlayer() {
  const { orientation } = useViewport()
  const safeArea = useSafeArea()

  return (
    <div
      className={orientation === 'landscape' ? 'fullscreen' : 'normal'}
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
      }}
    >
      <video />
    </div>
  )
}
```

## 性能优化

### 1. 避免重复创建

```tsx
// ❌ 每次渲染都创建新的配置对象
const { handleTouchStart } = useTouch({
  onSwipeLeft: () => console.log('left'),
})

// ✅ 使用 useCallback
const handleSwipeLeft = useCallback(() => {
  console.log('left')
}, [])

const { handleTouchStart } = useTouch({
  onSwipeLeft: handleSwipeLeft,
})
```

### 2. 条件性使用

```tsx
// ✅ 只在需要时使用
function MyComponent() {
  const isMobile = window.innerWidth < 768
  
  // 只在移动端使用触摸手势
  const touchHandlers = isMobile ? useTouch({
    onSwipeLeft: handleSwipe,
  }) : null

  return isMobile ? (
    <div {...touchHandlers}>移动端</div>
  ) : (
    <div onClick={handleClick}>桌面端</div>
  )
}
```

## 最佳实践

### ✅ 推荐做法

```tsx
// 1. 组合使用多个 Hooks
function MyComponent() {
  const { width } = useViewport()
  const network = useNetwork()
  const safeArea = useSafeArea()
  
  // 根据多个条件做决策
  if (width < 375 && network.effectiveType === '2g') {
    return <SimplifiedView />
  }
}

// 2. 使用 useCallback 优化回调
const handleReachBottom = useCallback(() => {
  loadMore()
}, [loadMore])

useScroll({ onReachBottom: handleReachBottom })

// 3. 解构需要的值
const { scrollY } = useScroll()  // 只需要scrollY
```

### ❌ 不推荐做法

```tsx
// ❌ 在循环中使用 Hooks
list.map(() => {
  const touch = useTouch() // 错误！
})

// ❌ 条件性调用 Hooks
if (condition) {
  const touch = useTouch() // 错误！
}

// ❌ 过度使用
function SimpleComponent() {
  const viewport = useViewport()
  const network = useNetwork()
  const safeArea = useSafeArea()
  // 如果不需要，不要使用
}
```

## 常见问题

### Q1: useTouch 不工作？

**检查：**
- 是否在正确的元素上绑定了 onTouchStart/Move/End
- threshold 是否设置过大
- 是否在触摸设备上测试

### Q2: useScroll 触发太频繁？

**解决：**
```tsx
useScroll({
  throttle: 200, // 增加节流时间
})
```

### Q3: useSafeArea 获取不到值？

**原因：** 可能设备不支持或未正确配置 viewport

**解决：**
```html
<!-- index.html 中确保有 viewport-fit=cover -->
<meta name="viewport" content="viewport-fit=cover" />
```

### Q4: useNetwork 的 effectiveType 为 undefined？

**原因：** 部分浏览器不支持 Network Information API

**解决：**
```tsx
const { effectiveType = '4g' } = useNetwork() // 设置默认值
```

## 总结

移动端 Hooks 让你轻松处理：
- ✅ 触摸手势
- ✅ 滚动交互
- ✅ 屏幕适配
- ✅ 安全区域
- ✅ 网络状态

**记住：使用这些 Hooks 让移动端开发更简单！** 🎉

