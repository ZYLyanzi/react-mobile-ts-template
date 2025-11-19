# 📦 状态管理使用指南

## 快速上手

### 基础使用

```typescript
import { useUserStore } from '@/store'

function MyComponent() {
  // 获取状态
  const token = useUserStore((state) => state.token)
  const userInfo = useUserStore((state) => state.userInfo)
  
  // 获取方法
  const updateToken = useUserStore((state) => state.updateToken)
  
  // 使用
  updateToken('new-token')
}
```

## 核心概念

### Store 列表

项目中包含以下 Store：

| Store | 说明 | 持久化 |
|-------|------|--------|
| `useUserStore` | 用户信息、Token | ❌ |
| `useLoadingStore` | 全局Loading状态 | ❌ |
| `useAppStore` | 应用全局配置 | ✅ |
| `usePopupStore` | 弹窗状态管理 | ❌ |

## Store 详解

### 1. useUserStore - 用户状态

```typescript
import { useUserStore } from '@/store'

// 获取用户信息
const userInfo = useUserStore((state) => state.userInfo)

// 获取 Token
const token = useUserStore((state) => state.token)

// 更新 Token
const updateToken = useUserStore((state) => state.updateToken)
updateToken('new-token-here')

// 更新用户名
const updateUserName = useUserStore((state) => state.updateUserName)
updateUserName('新用户名')

// 清除 Token
const clearToken = useUserStore((state) => state.clearToken)
clearToken()

// 清除用户信息
const clearUserInfo = useUserStore((state) => state.clearUserInfo)
clearUserInfo()
```

### 2. useLoadingStore - Loading状态

```typescript
import { useLoadingStore } from '@/store'

// 获取 Loading 状态
const isLoading = useLoadingStore((state) => state.isLoading)

// 显示 Loading
const showLoading = useLoadingStore((state) => state.showLoading)
showLoading()

// 隐藏 Loading
const hideLoading = useLoadingStore((state) => state.hideLoading)
hideLoading()

// 或使用别名
const show = useLoadingStore((state) => state.show)
const hide = useLoadingStore((state) => state.hide)
```

**并发请求自动处理：**

```typescript
// 同时发起3个请求
showLoading() // count = 1
showLoading() // count = 2
showLoading() // count = 3

hideLoading() // count = 2, isLoading = true
hideLoading() // count = 1, isLoading = true
hideLoading() // count = 0, isLoading = false ✅
```

### 3. useAppStore - 应用配置

```typescript
import { useAppStore } from '@/store'

// 获取主题
const theme = useAppStore((state) => state.theme)

// 切换主题
const setTheme = useAppStore((state) => state.setTheme)
setTheme('dark') // 'light' | 'dark' | 'auto'

// 获取语言
const language = useAppStore((state) => state.language)

// 切换语言
const setLanguage = useAppStore((state) => state.setLanguage)
setLanguage('en-US') // 'zh-CN' | 'en-US'

// 设置应用标题
const setAppTitle = useAppStore((state) => state.setAppTitle)
setAppTitle('我的应用')

// 检查是否首次访问
const isFirstVisit = useAppStore((state) => state.isFirstVisit)

// 标记已访问
const markVisited = useAppStore((state) => state.markVisited)
markVisited()

// 重置应用状态
const reset = useAppStore((state) => state.reset)
reset()
```

**自动持久化：**

主题、语言、首次访问状态会自动保存到 localStorage，刷新页面不会丢失。

### 4. usePopupStore - 弹窗管理

```typescript
import { usePopupStore } from '@/store'
import { PopupNames } from '@/constants'

// 在弹窗组件中注册
function MyPopup() {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()
  
  useEffect(() => {
    // 注册弹窗
    setPopup(PopupNames.DEMO, {
      show: visible,
      setShow: setVisible,
    })
    
    // 组件卸载时移除
    return () => removePopup(PopupNames.DEMO)
  }, [visible])
  
  return (
    <Popup visible={visible} onMaskClick={() => setVisible(false)}>
      {/* 弹窗内容 */}
    </Popup>
  )
}

// 在其他地方控制弹窗（配合 usePopup Hook）
import { usePopup } from '@/hooks'

const { popShow } = usePopup()
popShow(PopupNames.DEMO)
```

## 创建自定义 Store

### 方式1: 简单 Store（无持久化）

```typescript
// src/store/modules/use-cart-store.ts
import { createSimpleStore } from '@/store'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clear: () => void
}

export const useCartStore = createSimpleStore<CartStore>(
  (set) => ({
    items: [],
    
    addItem: (item) =>
      set((state) => ({
        items: [...state.items, item],
      })),
    
    removeItem: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
    
    clear: () => set({ items: [] }),
  }),
  'cart-store' // Store 名称
)
```

### 方式2: 持久化 Store

```typescript
// src/store/modules/use-settings-store.ts
import { createPersistedStore } from '@/store'

interface SettingsStore {
  fontSize: number
  notificationsEnabled: boolean
  setFontSize: (size: number) => void
  toggleNotifications: () => void
}

export const useSettingsStore = createPersistedStore<SettingsStore>(
  (set) => ({
    fontSize: 14,
    notificationsEnabled: true,
    
    setFontSize: (fontSize) => set({ fontSize }),
    
    toggleNotifications: () =>
      set((state) => ({
        notificationsEnabled: !state.notificationsEnabled,
      })),
  }),
  {
    name: 'settings-store',
    persistOptions: {
      // 部分持久化（可选）
      partialize: (state) => ({
        fontSize: state.fontSize,
        notificationsEnabled: state.notificationsEnabled,
      }),
    },
  }
)
```

### 方式3: 高级自定义

```typescript
import { createStore } from '@/store'

interface TodoStore {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  setFilter: (filter: 'all' | 'active' | 'completed') => void
}

export const useTodoStore = createStore<TodoStore>(
  (set) => ({
    todos: [],
    filter: 'all',
    
    addTodo: (text) =>
      set((state) => ({
        todos: [
          ...state.todos,
          { id: Date.now().toString(), text, completed: false },
        ],
      })),
    
    toggleTodo: (id) =>
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      })),
    
    setFilter: (filter) => set({ filter }),
  }),
  {
    name: 'todo-store',
    persist: true, // 启用持久化
    devtools: true, // 启用 devtools
  }
)
```

## 性能优化

### 1. 选择性订阅

```typescript
// ❌ 不推荐：订阅整个 store
const store = useUserStore()

// ✅ 推荐：只订阅需要的字段
const username = useUserStore((state) => state.userInfo.username)
```

### 2. 使用浅比较

```typescript
import { shallow } from 'zustand/shallow'

// 订阅多个字段
const { token, userInfo } = useUserStore(
  (state) => ({
    token: state.token,
    userInfo: state.userInfo,
  }),
  shallow
)
```

### 3. 计算属性

```typescript
// 使用选择器计算派生状态
const activeCount = useTodoStore(
  (state) => state.todos.filter((todo) => !todo.completed).length
)
```

### 4. 在非组件中使用

```typescript
import { useUserStore } from '@/store'

// 直接调用 getState
const token = useUserStore.getState().token

// 直接调用方法
useUserStore.getState().updateToken('new-token')

// 订阅变化
const unsubscribe = useUserStore.subscribe(
  (state) => state.token,
  (token) => console.log('Token changed:', token)
)

// 取消订阅
unsubscribe()
```

## DevTools

### 安装 Redux DevTools

1. 安装浏览器插件：[Redux DevTools](https://github.com/reduxjs/redux-devtools-extension)
2. 打开浏览器 DevTools
3. 切换到 Redux 面板
4. 查看所有 Store 的状态和变化

### 使用 DevTools

```typescript
// Store 会自动启用 DevTools（仅开发环境）
// 可以看到：
// - 当前状态
// - 历史记录
// - 状态变化
// - 时间旅行调试
```

## 持久化存储

### 默认配置

- 存储位置：`localStorage`
- 存储格式：JSON
- 自动序列化/反序列化

### 自定义存储

```typescript
import { createPersistedStore } from '@/store'
import { createJSONStorage } from 'zustand/middleware'

export const useMyStore = createPersistedStore(
  (set) => ({
    // ...
  }),
  {
    name: 'my-store',
    persistOptions: {
      storage: createJSONStorage(() => sessionStorage), // 使用 sessionStorage
    },
  }
)
```

### 版本迁移

```typescript
import { createPersistedStore } from '@/store'

export const useMyStore = createPersistedStore(
  (set) => ({
    // ...
  }),
  {
    name: 'my-store',
    persistOptions: {
      version: 2, // 版本号
      migrate: (persistedState: any, version: number) => {
        // 版本 1 -> 2 的迁移逻辑
        if (version === 1) {
          return {
            ...persistedState,
            newField: 'default-value',
          }
        }
        return persistedState
      },
    },
  }
)
```

## 最佳实践

### ✅ 推荐做法

```typescript
// 1. 按功能划分 Store
// ✅ useUserStore, useCartStore, useSettingsStore
// ❌ useGlobalStore (所有状态混在一起)

// 2. 状态扁平化
// ✅
interface UserStore {
  token: string
  username: string
  avatar: string
}

// ❌
interface UserStore {
  user: {
    info: {
      profile: {
        name: string
      }
    }
  }
}

// 3. 方法命名规范
// ✅ setToken, updateUser, clearCart, toggleTheme
// ❌ doSomething, handleClick, func1

// 4. 选择性订阅
const username = useUserStore((state) => state.userInfo.username)

// 5. 提供重置方法
reset: () => set(initialState)
```

### ❌ 不推荐做法

```typescript
// ❌ 在 Store 中直接调用 API
badMethod: async () => {
  const data = await api.getData()
  set({ data })
}

// ✅ 在组件中调用 API，然后更新 Store
const fetchData = async () => {
  const data = await api.getData()
  updateData(data)
}

// ❌ 过度使用全局状态
// 组件内部状态应该用 useState

// ❌ 循环依赖
// Store A 依赖 Store B，Store B 依赖 Store A
```

## 常见问题

### Q1: 如何在多个组件间共享状态？

直接使用同一个 Store：

```typescript
// ComponentA.tsx
const count = useCountStore((state) => state.count)

// ComponentB.tsx
const count = useCountStore((state) => state.count) // 同步更新
```

### Q2: 如何在非组件中使用 Store？

```typescript
import { useUserStore } from '@/store'

// 获取状态
const token = useUserStore.getState().token

// 更新状态
useUserStore.getState().updateToken('new-token')
```

### Q3: 持久化的数据如何清除？

```typescript
// 方法1：调用 reset 方法
useAppStore.getState().reset()

// 方法2：直接清除 localStorage
localStorage.removeItem('app-store')
```

### Q4: 如何监听 Store 变化？

```typescript
import { useEffect } from 'react'
import { useUserStore } from '@/store'

useEffect(() => {
  // 订阅 token 变化
  const unsubscribe = useUserStore.subscribe(
    (state) => state.token,
    (token) => {
      console.log('Token changed:', token)
    }
  )
  
  return () => unsubscribe()
}, [])
```

### Q5: Store 太大，如何拆分？

```typescript
// 按功能拆分为多个 Store
import { useUserStore } from '@/store/modules/use-user-store'
import { useCartStore } from '@/store/modules/use-cart-store'
import { useOrderStore } from '@/store/modules/use-order-store'

// 在组件中按需使用
const username = useUserStore((state) => state.username)
const cartCount = useCartStore((state) => state.items.length)
```

## 调试技巧

### 1. 查看当前状态

```typescript
console.log(useUserStore.getState())
```

### 2. 使用 Redux DevTools

打开浏览器 DevTools -> Redux 面板

### 3. 添加日志

```typescript
export const useMyStore = createStore(
  (set) => ({
    count: 0,
    increment: () => {
      console.log('Before:', useMyStore.getState().count)
      set((state) => ({ count: state.count + 1 }))
      console.log('After:', useMyStore.getState().count)
    },
  }),
  { name: 'my-store' }
)
```

## 总结

1. **简单易用** - 基于 Zustand，API 简洁
2. **类型安全** - 完整的 TypeScript 支持
3. **灵活配置** - 支持持久化、DevTools
4. **性能优越** - 选择性订阅，避免不必要的渲染
5. **开箱即用** - 提供常用 Store 和创建工具

**记住：状态管理应该让开发更简单，而不是更复杂！** 🎉

