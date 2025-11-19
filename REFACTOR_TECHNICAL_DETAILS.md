# 🔧 React 移动端模板 - 技术细节与实施方案

> 详细的技术实现方案和代码示例

---

## 📑 目录

1. [移动端适配实现](#1-移动端适配实现)
2. [API请求封装](#2-api请求封装)
3. [弹窗管理实现](#3-弹窗管理实现)
4. [状态管理优化](#4-状态管理优化)
5. [移动端Hooks实现](#5-移动端hooks实现)
6. [工具函数实现](#6-工具函数实现)
7. [样式方案](#7-样式方案)
8. [环境配置](#8-环境配置)

---

## 1. 移动端适配实现

### 1.1 PostCSS配置

**文件：`postcss.config.ts`**
```typescript
import pxtorem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [
        'Android >= 4.0',
        'iOS >= 8',
      ],
    }),
    pxtorem({
      rootValue: 75, // 设计稿宽度 750px / 10
      unitPrecision: 5, // rem小数点位数
      propList: ['*'], // 所有属性都转换
      selectorBlackList: ['norem', 'ant-'], // 黑名单
      replace: true,
      mediaQuery: false,
      minPixelValue: 1, // 最小转换值
      exclude: /node_modules\/(?!antd-mobile)/, // 排除node_modules，但包含antd-mobile
    }),
  ],
}
```

### 1.2 Flexible实现

**文件：`src/utils/flexible.ts`**
```typescript
/**
 * 移动端flexible适配方案
 * 设计稿宽度：750px
 * 基准值：75 (750/10)
 */

const flexible = () => {
  const doc = document
  const win = window
  const docEl = doc.documentElement
  const dpr = win.devicePixelRatio || 1

  // 设置body字体大小
  const setBodyFontSize = () => {
    if (doc.body) {
      doc.body.style.fontSize = 12 * dpr + 'px'
    } else {
      doc.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // 设置rem基准值
  const setRemUnit = () => {
    const width = docEl.clientWidth
    // 限制最大和最小宽度
    const rem = Math.min(Math.max(width / 10, 32), 75)
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 窗口大小改变时重新计算
  win.addEventListener('resize', setRemUnit)
  win.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 检测0.5px支持
  if (dpr >= 2) {
    const fakeBody = doc.createElement('body')
    const testElement = doc.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}

// 立即执行
flexible()

export default flexible
```

### 1.3 Vite配置（移动端优化）

**文件：`vite.config.ts`**
```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import { inspectorServer } from '@react-dev-inspector/vite-plugin'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_NODE_ENV === 'development' ? './' : '/',
    
    plugins: [
      react(),
      inspectorServer(),
      checker({ typescript: true, eslint: { useFlatConfig: true } }),
      svgr(), // SVG转组件
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/scss/index.scss" as *;`,
        },
      },
      // postcss配置会自动读取postcss.config.ts
    },

    server: {
      host: '0.0.0.0', // 局域网访问
      port: Number(env.VITE_APP_PORT) || 3000,
      open: false,
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_SERVER_URL,
          changeOrigin: true,
          rewrite: (path: string) =>
            path.replace(new RegExp('^' + env.VITE_API_BASE_URL), ''),
        },
      },
    },

    build: {
      target: 'es2015', // 兼容性
      outDir: env.VITE_OUT_DIR || 'dist',
      chunkSizeWarningLimit: 1000, // 移动端控制包体积
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router'],
            'vendor-ui': ['antd-mobile'],
            'vendor-utils': ['axios', 'dayjs', 'zustand', 'ahooks'],
          },
        },
      },
      minify: 'esbuild', // 使用esbuild压缩（更快）
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        'antd-mobile',
        'zustand',
        'axios',
        'dayjs',
        'ahooks',
      ],
    },
  }
})
```

### 1.4 Tailwind配置（移动端优化）

**文件：`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '375px',
      md: '414px',
      lg: '768px',
      xl: '1024px',
    },
    extend: {
      colors: {
        primary: '#1677ff',
        success: '#00b578',
        warning: '#ff8f1f',
        danger: '#ff3141',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)', // 安全区域
      },
    },
  },
  plugins: [],
  // 确保与postcss-pxtorem兼容
  corePlugins: {
    preflight: true,
  },
}
```

### 1.5 HTML模板修改

**文件：`index.html`**
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    
    <!-- 移动端viewport配置 -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    
    <!-- iOS状态栏 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- 禁止识别电话号码 -->
    <meta name="format-detection" content="telephone=no" />
    
    <title>React Mobile Template</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 2. API请求封装

### 2.1 Axios实例配置

**文件：`src/services/service.ts`**
```typescript
import axios, { AxiosInstance } from 'axios'
import { requestInterceptor, responseInterceptor } from './interceptors'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 应用拦截器
service.interceptors.request.use(
  requestInterceptor.onFulfilled,
  requestInterceptor.onRejected
)

service.interceptors.response.use(
  responseInterceptor.onFulfilled,
  responseInterceptor.onRejected
)

export default service
```

### 2.2 请求拦截器

**文件：`src/services/interceptors/request.ts`**
```typescript
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { cancelRequest } from '../cancel'
import { useUserStore } from '@/store'

export const requestInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // 添加token
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求取消控制
    cancelRequest.addPending(config)

    // 可选：显示loading
    // useLoadingStore.getState().show()

    return config
  },

  onRejected: (error: AxiosError) => {
    return Promise.reject(error)
  },
}

export default requestInterceptor
```

### 2.3 响应拦截器

**文件：`src/services/interceptors/response.ts`**
```typescript
import type { AxiosResponse, AxiosError } from 'axios'
import { Toast } from 'antd-mobile'
import { cancelRequest } from '../cancel'
import { errorHandler } from '../error-handler'

export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    // 移除pending请求
    cancelRequest.removePending(response.config)

    // 隐藏loading
    // useLoadingStore.getState().hide()

    // 业务逻辑处理
    const { code, data, message } = response.data

    if (code === 200 || code === 0) {
      return data
    } else {
      // 错误处理
      errorHandler(code, message)
      return Promise.reject(response.data)
    }
  },

  onRejected: (error: AxiosError) => {
    // 隐藏loading
    // useLoadingStore.getState().hide()

    // 取消请求不提示
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    // 网络错误
    if (!error.response) {
      Toast.show({
        icon: 'fail',
        content: '网络连接失败',
      })
      return Promise.reject(error)
    }

    // HTTP错误
    const { status } = error.response
    errorHandler(status)

    return Promise.reject(error)
  },
}

export default responseInterceptor
```

### 2.4 请求取消控制

**文件：`src/services/cancel.ts`**
```typescript
import type { InternalAxiosRequestConfig } from 'axios'

class CancelRequest {
  // 存储pending请求
  private pendingMap = new Map<string, AbortController>()

  /**
   * 生成请求key
   */
  private getRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  /**
   * 添加pending请求
   */
  addPending(config: InternalAxiosRequestConfig) {
    // 移除之前的重复请求
    this.removePending(config)

    const requestKey = this.getRequestKey(config)
    const controller = new AbortController()

    config.signal = controller.signal
    this.pendingMap.set(requestKey, controller)
  }

  /**
   * 移除pending请求
   */
  removePending(config: InternalAxiosRequestConfig) {
    const requestKey = this.getRequestKey(config)
    const controller = this.pendingMap.get(requestKey)

    if (controller) {
      controller.abort()
      this.pendingMap.delete(requestKey)
    }
  }

  /**
   * 清空所有pending请求
   */
  clearPending() {
    this.pendingMap.forEach((controller) => {
      controller.abort()
    })
    this.pendingMap.clear()
  }
}

export const cancelRequest = new CancelRequest()
```

### 2.5 错误处理

**文件：`src/services/error-handler.ts`**
```typescript
import { Toast } from 'antd-mobile'
import { useUserStore } from '@/store'

/**
 * 错误处理白名单
 * 这些接口的错误不会显示Toast
 */
const errorWhiteList = ['/api/login', '/api/refresh-token']

/**
 * 统一错误处理
 */
export const errorHandler = (code: number, message?: string) => {
  // 检查白名单
  if (errorWhiteList.some((url) => window.location.href.includes(url))) {
    return
  }

  switch (code) {
    case 400:
      Toast.show({ icon: 'fail', content: message || '请求参数错误' })
      break
    case 401:
      Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' })
      // 清除token，跳转登录页
      useUserStore.getState().clearToken()
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
      break
    case 403:
      Toast.show({ icon: 'fail', content: '没有权限访问' })
      break
    case 404:
      Toast.show({ icon: 'fail', content: '请求的资源不存在' })
      break
    case 500:
      Toast.show({ icon: 'fail', content: '服务器错误' })
      break
    case 502:
      Toast.show({ icon: 'fail', content: '网关错误' })
      break
    case 503:
      Toast.show({ icon: 'fail', content: '服务不可用' })
      break
    default:
      Toast.show({ icon: 'fail', content: message || '请求失败' })
  }
}
```

### 2.6 类型定义

**文件：`src/services/types.ts`**
```typescript
/**
 * 通用响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PageData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 请求配置扩展
 */
export interface RequestConfig {
  showLoading?: boolean // 是否显示loading
  showError?: boolean // 是否显示错误提示
  cancelable?: boolean // 是否可取消
}
```

---

## 3. 弹窗管理实现

### 3.1 弹窗名称枚举

**文件：`src/constants/popup-names.ts`**
```typescript
/**
 * 弹窗名称枚举
 * 使用枚举管理所有弹窗名称，避免字符串拼写错误
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

export type PopupName = `${PopupNames}`
```

### 3.2 弹窗Store

**文件：`src/store/modules/use-popup-store.ts`**
```typescript
import { create } from 'zustand'
import type { PopupNames } from '@/constants'

interface PopupItem {
  show: boolean
  setShow: (show: boolean) => void
}

interface PopupStore {
  list: Map<PopupNames, PopupItem>
  setPopup: (key: PopupNames, item: PopupItem) => void
  removePopup: (key: PopupNames) => void
  clear: () => void
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  list: new Map(),

  /**
   * 注册弹窗
   */
  setPopup: (key, item) => {
    const list = new Map(get().list)
    
    if (list.has(key)) {
      console.warn(`弹窗已注册: ${key}`)
    }
    
    list.set(key, item)
    set({ list })
  },

  /**
   * 移除弹窗
   */
  removePopup: (key) => {
    const list = new Map(get().list)
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
```

### 3.3 usePopup Hook

**文件：`src/hooks/use-popup/index.ts`**
```typescript
import { usePopupStore } from '@/store'
import type { PopupNames } from '@/constants'

export function usePopup() {
  const list = usePopupStore((state) => state.list)

  /**
   * 打开弹窗
   * @param key 弹窗名称
   * @param closeOthers 是否关闭其他弹窗
   */
  const popShow = (key: PopupNames, closeOthers = false) => {
    const popup = list.get(key)

    if (!popup) {
      console.warn(`弹窗未注册: ${key}`)
      return
    }

    if (popup.show) {
      console.warn(`弹窗已打开: ${key}`)
      return
    }

    // 关闭其他弹窗
    if (closeOthers) {
      popCloseAll()
    }

    popup.setShow(true)
  }

  /**
   * 关闭弹窗
   */
  const popClose = (key: PopupNames) => {
    const popup = list.get(key)

    if (!popup) {
      console.warn(`弹窗未注册: ${key}`)
      return
    }

    if (!popup.show) {
      console.warn(`弹窗已关闭: ${key}`)
      return
    }

    popup.setShow(false)
  }

  /**
   * 关闭所有弹窗
   */
  const popCloseAll = () => {
    list.forEach((popup) => {
      if (popup.show) {
        popup.setShow(false)
      }
    })
  }

  /**
   * 获取打开的弹窗列表
   */
  const getOpenPopups = () => {
    const openList: PopupNames[] = []
    list.forEach((popup, key) => {
      if (popup.show) {
        openList.push(key)
      }
    })
    return openList
  }

  return {
    popShow,
    popClose,
    popCloseAll,
    getOpenPopups,
  }
}
```

### 3.4 弹窗使用示例

**文件：`src/components/popups/demo-popup.tsx`**
```typescript
import { useEffect, useState } from 'react'
import { Popup } from 'antd-mobile'
import { usePopupStore } from '@/store'
import { PopupNames } from '@/constants'

export const DemoPopup = () => {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()

  // 注册弹窗
  useEffect(() => {
    setPopup(PopupNames.DEMO, {
      show: visible,
      setShow: setVisible,
    })

    return () => {
      removePopup(PopupNames.DEMO)
    }
  }, [visible])

  return (
    <Popup
      visible={visible}
      onMaskClick={() => setVisible(false)}
      bodyStyle={{ minHeight: '40vh' }}
    >
      <div className="p-4">
        <h3>示例弹窗</h3>
        <p>这是一个示例弹窗</p>
      </div>
    </Popup>
  )
}
```

---

## 4. 状态管理优化

### 4.1 Store创建工具

**文件：`src/store/create-store.ts`**
```typescript
import { create, StateCreator } from 'zustand'
import { persist, devtools, PersistOptions } from 'zustand/middleware'

interface StoreConfig<T> {
  /** Store名称 */
  name: string
  /** 是否持久化 */
  persist?: boolean
  /** 持久化配置 */
  persistOptions?: Omit<PersistOptions<T>, 'name'>
  /** 是否启用devtools */
  devtools?: boolean
}

/**
 * 创建Store的工具函数
 * 支持持久化、devtools等中间件
 */
export function createStore<T>(
  stateCreator: StateCreator<T>,
  config: StoreConfig<T>
) {
  const { name, persist: enablePersist, persistOptions, devtools: enableDevtools } = config

  let store = stateCreator

  // 应用persist中间件
  if (enablePersist) {
    store = persist(stateCreator, {
      name,
      ...persistOptions,
    }) as StateCreator<T>
  }

  // 应用devtools中间件（仅开发环境）
  if (enableDevtools && import.meta.env.DEV) {
    store = devtools(store, { name }) as StateCreator<T>
  }

  return create<T>()(store)
}
```

### 4.2 用户Store示例

**文件：`src/store/modules/use-user-store.ts`**
```typescript
import { createStore } from '../create-store'

interface UserInfo {
  id: string
  name: string
  avatar: string
  email: string
}

interface UserStore {
  token: string | null
  userInfo: UserInfo | null
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  clearToken: () => void
  clear: () => void
}

export const useUserStore = createStore<UserStore>(
  (set) => ({
    token: null,
    userInfo: null,

    setToken: (token) => set({ token }),
    
    setUserInfo: (userInfo) => set({ userInfo }),
    
    clearToken: () => set({ token: null }),
    
    clear: () => set({ token: null, userInfo: null }),
  }),
  {
    name: 'user-store',
    persist: true, // 持久化
    devtools: true, // 开启devtools
    persistOptions: {
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
      }),
    },
  }
)
```

---

## 5. 移动端Hooks实现

### 5.1 useTouch - 触摸手势

**文件：`src/hooks/use-touch/index.ts`**
```typescript
import { useRef, useEffect } from 'react'

interface TouchPosition {
  startX: number
  startY: number
  endX: number
  endY: number
  deltaX: number
  deltaY: number
}

interface UseTouchOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number // 滑动距离阈值
}

export function useTouch(options: UseTouchOptions = {}) {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50 } = options
  const position = useRef<TouchPosition>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    deltaX: 0,
    deltaY: 0,
  })

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    position.current.startX = touch.clientX
    position.current.startY = touch.clientY
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    position.current.endX = touch.clientX
    position.current.endY = touch.clientY
    position.current.deltaX = position.current.endX - position.current.startX
    position.current.deltaY = position.current.endY - position.current.startY
  }

  const handleTouchEnd = () => {
    const { deltaX, deltaY } = position.current

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft()
      }
    } else {
      // 垂直滑动
      if (deltaY > threshold && onSwipeDown) {
        onSwipeDown()
      } else if (deltaY < -threshold && onSwipeUp) {
        onSwipeUp()
      }
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    position: position.current,
  }
}
```

### 5.2 useViewport - 视口信息

**文件：`src/hooks/use-viewport/index.ts`**
```typescript
import { useState, useEffect } from 'react'

interface ViewportInfo {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
}

export function useViewport() {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
  })

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      })
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return viewport
}
```

### 5.3 useSafeArea - 安全区域

**文件：`src/hooks/use-safe-area/index.ts`**
```typescript
import { useState, useEffect } from 'react'

interface SafeArea {
  top: number
  right: number
  bottom: number
  left: number
}

export function useSafeArea() {
  const [safeArea, setSafeArea] = useState<SafeArea>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement)

    setSafeArea({
      top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
      right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
      left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
    })
  }, [])

  return safeArea
}
```

---

## 6. 工具函数实现

### 6.1 移动端工具

**文件：`src/utils/mobile.ts`**
```typescript
/**
 * 判断是否为iOS设备
 */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * 判断是否为Android设备
 */
export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

/**
 * 判断是否为微信浏览器
 */
export function isWechat(): boolean {
  return /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * 判断是否在App内
 */
export function isApp(): boolean {
  // 根据实际App的UA特征判断
  return /YourApp/i.test(navigator.userAgent)
}

/**
 * 获取设备信息
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent
  return {
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isWechat: isWechat(),
    isApp: isApp(),
    userAgent: ua,
  }
}
```

### 6.2 存储工具

**文件：`src/utils/storage.ts`**
```typescript
/**
 * 增强版localStorage
 */
class Storage {
  /**
   * 设置数据
   */
  set<T>(key: string, value: T): void {
    try {
      const data = JSON.stringify({
        value,
        timestamp: Date.now(),
      })
      localStorage.setItem(key, data)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  /**
   * 获取数据
   */
  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      if (!data) return null

      const parsed = JSON.parse(data)
      return parsed.value as T
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  /**
   * 移除数据
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    localStorage.clear()
  }

  /**
   * 检查是否存在
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }
}

export const storage = new Storage()
```

---

## 7. 样式方案

### 7.1 SCSS变量

**文件：`src/styles/scss/var.scss`**
```scss
// 颜色
$primary-color: #1677ff;
$success-color: #00b578;
$warning-color: #ff8f1f;
$danger-color: #ff3141;
$text-color: #333333;
$text-secondary: #666666;
$text-placeholder: #999999;
$border-color: #eeeeee;
$bg-color: #f5f5f5;

// 字号
$font-size-xs: 10px;
$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-lg: 16px;
$font-size-xl: 18px;
$font-size-xxl: 20px;

// 间距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 20px;
$spacing-xxl: 24px;

// 圆角
$radius-sm: 2px;
$radius-md: 4px;
$radius-lg: 8px;
$radius-xl: 12px;
$radius-round: 50%;

// 阴影
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);

// Z-index
$z-index-dropdown: 1000;
$z-index-fixed: 1010;
$z-index-modal-backdrop: 1020;
$z-index-modal: 1030;
$z-index-popover: 1040;
$z-index-tooltip: 1050;
```

### 7.2 Mixins

**文件：`src/styles/scss/mixins.scss`**
```scss
// 清除浮动
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

// 文本溢出省略
@mixin ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
  }
}

// Flex居中
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 1px边框
@mixin hairline($direction: all, $color: $border-color) {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;

    @if $direction == all {
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      border: 1px solid $color;
      transform: scale(0.5);
      transform-origin: 0 0;
    } @else if $direction == top {
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: $color;
      transform: scaleY(0.5);
    } @else if $direction == bottom {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: $color;
      transform: scaleY(0.5);
    }
  }
}

// 安全区域适配
@mixin safe-area-inset($position: bottom, $property: padding) {
  #{$property}-#{$position}: constant(safe-area-inset-#{$position});
  #{$property}-#{$position}: env(safe-area-inset-#{$position});
}
```

---

## 8. 环境配置

### 8.1 环境变量示例

**文件：`.env.dev`**
```bash
# 环境标识
VITE_NODE_ENV=development

# API配置
VITE_API_BASE_URL=/api
VITE_SERVER_URL=https://dev-api.example.com

# 移动端配置
VITE_ENABLE_VCONSOLE=true
VITE_ENABLE_FLEXIBLE=true
VITE_DESIGN_WIDTH=750
VITE_ROOT_VALUE=75

# 端口配置
VITE_APP_PORT=3000

# 输出目录
VITE_OUT_DIR=dist-dev
```

**文件：`.env.pro`**
```bash
# 环境标识
VITE_NODE_ENV=production

# API配置
VITE_API_BASE_URL=/api
VITE_SERVER_URL=https://api.example.com

# 移动端配置
VITE_ENABLE_VCONSOLE=false
VITE_ENABLE_FLEXIBLE=true
VITE_DESIGN_WIDTH=750
VITE_ROOT_VALUE=75

# 端口配置
VITE_APP_PORT=3000

# 输出目录
VITE_OUT_DIR=dist
```

---

**文档创建**: 2025-11-19  
**版本**: v1.0  
**关联文档**: [改造执行计划](./REFACTOR_PLAN.md)

