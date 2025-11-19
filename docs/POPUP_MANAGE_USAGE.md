# 🎭 弹窗管理使用指南

## 核心理念

**集中式弹窗状态管理**，让你可以在任何地方控制弹窗的打开和关闭。

### 优势

- ✅ **全局控制** - 在任何组件中都能控制弹窗
- ✅ **类型安全** - 使用枚举避免拼写错误
- ✅ **批量操作** - 支持关闭所有弹窗
- ✅ **状态追踪** - 知道哪些弹窗正在显示
- ✅ **简单易用** - API 简洁直观

## 快速上手

### 步骤 1: 定义弹窗名称

```typescript
// src/constants/popup-names.ts
export enum PopupNames {
  DEMO = 'DEMO',
  CONFIRM = 'CONFIRM',
  MY_POPUP = 'MY_POPUP', // 添加你的弹窗
}
```

### 步骤 2: 创建弹窗组件

```tsx
import { useEffect, useState } from 'react'
import { Popup, Button } from 'antd-mobile'
import { usePopupStore } from '@/store'
import { PopupNames } from '@/constants'

export function MyPopup() {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()

  // 注册弹窗
  useEffect(() => {
    setPopup(PopupNames.MY_POPUP, {
      show: visible,
      setShow: setVisible,
    })

    // 组件卸载时移除
    return () => {
      removePopup(PopupNames.MY_POPUP)
    }
  }, [visible])

  return (
    <Popup
      visible={visible}
      onMaskClick={() => setVisible(false)}
      bodyStyle={{ padding: '20px' }}
    >
      <h3>我的弹窗</h3>
      <Button onClick={() => setVisible(false)}>关闭</Button>
    </Popup>
  )
}
```

### 步骤 3: 在页面中引入弹窗

```tsx
import { MyPopup } from '@/components/popups'

function MyPage() {
  return (
    <div>
      {/* 页面内容 */}
      
      {/* 在页面底部引入弹窗组件 */}
      <MyPopup />
    </div>
  )
}
```

### 步骤 4: 在任何地方控制弹窗

```tsx
import { usePopup } from '@/hooks'
import { PopupNames } from '@/constants'

function AnyComponent() {
  const { popShow, popClose } = usePopup()

  return (
    <>
      <button onClick={() => popShow(PopupNames.MY_POPUP)}>
        打开弹窗
      </button>
      <button onClick={() => popClose(PopupNames.MY_POPUP)}>
        关闭弹窗
      </button>
    </>
  )
}
```

## 完整示例

### 示例 1: 简单弹窗

```tsx
// 1. 定义弹窗名称
export enum PopupNames {
  TIPS = 'TIPS',
}

// 2. 创建弹窗组件
import { useEffect, useState } from 'react'
import { Popup } from 'antd-mobile'
import { usePopupStore } from '@/store'
import { PopupNames } from '@/constants'

export function TipsPopup() {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()

  useEffect(() => {
    setPopup(PopupNames.TIPS, { show: visible, setShow: setVisible })
    return () => removePopup(PopupNames.TIPS)
  }, [visible])

  return (
    <Popup
      visible={visible}
      onMaskClick={() => setVisible(false)}
      bodyStyle={{ padding: '40px', textAlign: 'center' }}
    >
      <p style={{ fontSize: '28px' }}>这是一个提示</p>
    </Popup>
  )
}

// 3. 使用
import { usePopup } from '@/hooks'
const { popShow } = usePopup()
popShow(PopupNames.TIPS)
```

### 示例 2: 带参数的弹窗

```tsx
// 创建带参数的弹窗
interface ProductDetailPopupProps {
  productId?: string
}

export function ProductDetailPopup({ productId }: ProductDetailPopupProps) {
  const [visible, setVisible] = useState(false)
  const [product, setProduct] = useState(null)
  const { setPopup, removePopup } = usePopupStore()

  // 注册弹窗
  useEffect(() => {
    setPopup(PopupNames.PRODUCT_DETAIL, {
      show: visible,
      setShow: setVisible,
    })
    return () => removePopup(PopupNames.PRODUCT_DETAIL)
  }, [visible])

  // 加载数据
  useEffect(() => {
    if (visible && productId) {
      fetchProductDetail(productId).then(setProduct)
    }
  }, [visible, productId])

  return (
    <Popup visible={visible} onMaskClick={() => setVisible(false)}>
      {product && (
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      )}
    </Popup>
  )
}

// 使用时传递参数
const [currentProductId, setCurrentProductId] = useState('')

<ProductDetailPopup productId={currentProductId} />

// 打开弹窗时设置ID
const handleShowProduct = (id: string) => {
  setCurrentProductId(id)
  popShow(PopupNames.PRODUCT_DETAIL)
}
```

### 示例 3: 确认弹窗

```tsx
import { usePopup } from '@/hooks'
import { PopupNames } from '@/constants'
import { ConfirmPopup } from '@/components/popups'
import { Toast } from 'antd-mobile'

function MyComponent() {
  const { popShow } = usePopup()
  const [confirmConfig, setConfirmConfig] = useState({})

  const handleDelete = () => {
    setConfirmConfig({
      title: '删除确认',
      content: '确定要删除这条数据吗？删除后无法恢复。',
      confirmText: '确定删除',
      cancelText: '取消',
      onConfirm: async () => {
        await deleteApi(itemId)
        Toast.show({ icon: 'success', content: '删除成功' })
      },
    })
    popShow(PopupNames.CONFIRM)
  }

  return (
    <div>
      <button onClick={handleDelete}>删除</button>
      <ConfirmPopup {...confirmConfig} />
    </div>
  )
}
```

## API 说明

### usePopup Hook

```typescript
const {
  popShow,        // 打开弹窗
  popClose,       // 关闭弹窗
  popCloseAll,    // 关闭所有弹窗
  getOpenPopups,  // 获取已打开的弹窗列表
  isPopupOpen,    // 检查弹窗是否打开
} = usePopup()
```

#### popShow(key, closeOthers?)

打开指定弹窗

```typescript
// 打开弹窗
popShow(PopupNames.DEMO)

// 打开弹窗并关闭其他（互斥模式）
popShow(PopupNames.DEMO, true)
```

#### popClose(key)

关闭指定弹窗

```typescript
popClose(PopupNames.DEMO)
```

#### popCloseAll()

关闭所有已打开的弹窗

```typescript
// 一键关闭所有弹窗
popCloseAll()
```

#### getOpenPopups()

获取当前打开的弹窗列表

```typescript
const openList = getOpenPopups()
console.log(openList) // [PopupNames.DEMO, PopupNames.CONFIRM]
```

#### isPopupOpen(key)

检查指定弹窗是否打开

```typescript
if (isPopupOpen(PopupNames.DEMO)) {
  console.log('DEMO弹窗正在显示')
}
```

## 高级用法

### 1. 互斥弹窗

一次只显示一个弹窗：

```typescript
// 打开新弹窗时自动关闭其他
popShow(PopupNames.DETAIL, true)
```

### 2. 弹窗链式调用

```typescript
const handleFlow = async () => {
  // 步骤1：显示提示
  popShow(PopupNames.TIPS)
  await delay(2000)
  popClose(PopupNames.TIPS)
  
  // 步骤2：显示确认
  popShow(PopupNames.CONFIRM)
}
```

### 3. 条件性打开弹窗

```typescript
const handleAction = () => {
  // 检查是否有其他弹窗打开
  const openPopups = getOpenPopups()
  
  if (openPopups.length > 0) {
    // 先关闭其他弹窗
    popCloseAll()
    setTimeout(() => {
      popShow(PopupNames.MY_POPUP)
    }, 300)
  } else {
    popShow(PopupNames.MY_POPUP)
  }
}
```

### 4. 弹窗嵌套

```tsx
function ParentPopup() {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()
  const { popShow } = usePopup()

  useEffect(() => {
    setPopup(PopupNames.PARENT, { show: visible, setShow: setVisible })
    return () => removePopup(PopupNames.PARENT)
  }, [visible])

  const handleOpenChild = () => {
    // 在父弹窗内打开子弹窗
    popShow(PopupNames.CHILD)
  }

  return (
    <Popup visible={visible}>
      <button onClick={handleOpenChild}>打开子弹窗</button>
      <ChildPopup />
    </Popup>
  )
}
```

### 5. 返回键关闭弹窗

```typescript
useEffect(() => {
  const handlePopState = () => {
    // 浏览器返回时关闭所有弹窗
    if (getOpenPopups().length > 0) {
      popCloseAll()
    }
  }

  window.addEventListener('popstate', handlePopState)
  return () => window.removeEventListener('popstate', handlePopState)
}, [])
```

## 最佳实践

### ✅ 推荐做法

```tsx
// 1. 使用枚举管理弹窗名称
popShow(PopupNames.DEMO) // ✅ 类型安全
popShow('DEMO') // ❌ 容易拼写错误

// 2. 在useEffect中注册和清理
useEffect(() => {
  setPopup(key, item)
  return () => removePopup(key)
}, [visible])

// 3. 统一管理弹窗组件
src/components/popups/
  ├── demo-popup.tsx
  ├── confirm-popup.tsx
  └── index.ts

// 4. 在根组件或布局组件中引入所有弹窗
<Layout>
  {children}
  <DemoPopup />
  <ConfirmPopup />
</Layout>
```

### ❌ 不推荐做法

```tsx
// ❌ 不要在多个地方创建同一个弹窗
<MyPopup />  // 在 PageA
<MyPopup />  // 在 PageB（会导致注册冲突）

// ❌ 不要忘记清理
useEffect(() => {
  setPopup(key, item)
  // 缺少 return cleanup
}, [visible])

// ❌ 不要直接操作 PopupStore
usePopupStore.getState().list.get(key)?.setShow(true)
// 应该使用 usePopup Hook

// ❌ 不要在循环中创建弹窗
{list.map(item => (
  <MyPopup key={item.id} /> // ❌
))}
```

## 常见问题

### Q1: 弹窗组件应该放在哪里？

**推荐方案：** 在布局组件或 App.tsx 中统一引入

```tsx
// src/app.tsx
import { DemoPopup, ConfirmPopup } from '@/components/popups'

function App() {
  return (
    <div>
      <Router />
      
      {/* 全局弹窗 */}
      <DemoPopup />
      <ConfirmPopup />
    </div>
  )
}
```

### Q2: 如何传递参数给弹窗？

**方案1: 使用 props**

```tsx
const [popupData, setPopupData] = useState(null)

<MyPopup data={popupData} />

// 打开时设置数据
const handleOpen = (data) => {
  setPopupData(data)
  popShow(PopupNames.MY_POPUP)
}
```

**方案2: 使用 Store**

```tsx
// 创建专用 Store
const usePopupDataStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))

// 在弹窗中使用
const data = usePopupDataStore((state) => state.data)

// 打开前设置数据
usePopupDataStore.getState().setData(data)
popShow(PopupNames.MY_POPUP)
```

### Q3: 如何在打开弹窗前执行异步操作？

```typescript
const handleOpenWithData = async () => {
  try {
    // 先加载数据
    const data = await fetchData()
    setPopupData(data)
    
    // 再打开弹窗
    popShow(PopupNames.DETAIL)
  } catch (error) {
    Toast.show('加载失败')
  }
}
```

### Q4: 多个相同弹窗如何处理？

**不推荐多个相同弹窗。** 如果需要，使用列表+单个弹窗：

```tsx
// ❌ 不要这样
{items.map(item => <ItemPopup key={item.id} item={item} />)}

// ✅ 这样做
const [currentItem, setCurrentItem] = useState(null)

<ItemPopup item={currentItem} />

const handleShowItem = (item) => {
  setCurrentItem(item)
  popShow(PopupNames.ITEM_DETAIL)
}
```

### Q5: 如何禁用弹窗背景滚动？

antd-mobile 的 Popup 组件已自动处理。如果需要自定义：

```tsx
<Popup
  visible={visible}
  bodyClassName="my-popup"
  getContainer={null} // 挂载到当前位置
  destroyOnClose // 关闭时销毁
  stopPropagation={['click']} // 阻止事件冒泡
>
```

## 内置弹窗组件

### DemoPopup - 示例弹窗

```tsx
import { DemoPopup } from '@/components/popups'
import { usePopup } from '@/hooks'
import { PopupNames } from '@/constants'

function MyPage() {
  const { popShow } = usePopup()

  return (
    <div>
      <button onClick={() => popShow(PopupNames.DEMO)}>
        打开示例弹窗
      </button>
      <DemoPopup />
    </div>
  )
}
```

### ConfirmPopup - 确认弹窗

```tsx
import { useState } from 'react'
import { ConfirmPopup } from '@/components/popups'
import { usePopup } from '@/hooks'
import { PopupNames } from '@/constants'
import { Toast } from 'antd-mobile'

function MyPage() {
  const { popShow } = usePopup()
  const [confirmConfig, setConfirmConfig] = useState({})

  const handleDelete = () => {
    setConfirmConfig({
      title: '删除确认',
      content: '确定要删除这条数据吗？',
      onConfirm: async () => {
        await deleteData()
        Toast.show('删除成功')
      },
    })
    popShow(PopupNames.CONFIRM)
  }

  return (
    <div>
      <button onClick={handleDelete}>删除</button>
      <ConfirmPopup {...confirmConfig} />
    </div>
  )
}
```

## 实战案例

### 案例 1: 购物车弹窗

```tsx
// 1. 定义弹窗名称
export enum PopupNames {
  CART = 'CART',
}

// 2. 创建弹窗组件
export function CartPopup() {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()
  const cartItems = useCartStore((state) => state.items)

  useEffect(() => {
    setPopup(PopupNames.CART, { show: visible, setShow: setVisible })
    return () => removePopup(PopupNames.CART)
  }, [visible])

  return (
    <Popup
      visible={visible}
      position="right"
      bodyStyle={{ width: '80vw', height: '100vh' }}
    >
      <h3>购物车 ({cartItems.length})</h3>
      {cartItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </Popup>
  )
}

// 3. 全局引入
<CartPopup />

// 4. 在任何地方打开
const { popShow } = usePopup()
<button onClick={() => popShow(PopupNames.CART)}>
  购物车
</button>
```

### 案例 2: 筛选弹窗

```tsx
export function FilterPopup() {
  const [visible, setVisible] = useState(false)
  const [filters, setFilters] = useState({})
  const { setPopup, removePopup } = usePopupStore()

  useEffect(() => {
    setPopup(PopupNames.FILTER, { show: visible, setShow: setVisible })
    return () => removePopup(PopupNames.FILTER)
  }, [visible])

  const handleConfirm = () => {
    // 应用筛选条件
    onFilterChange(filters)
    setVisible(false)
  }

  return (
    <Popup
      visible={visible}
      position="bottom"
      bodyStyle={{ minHeight: '50vh' }}
    >
      {/* 筛选表单 */}
      <Form>
        <Form.Item label="价格">
          <Input />
        </Form.Item>
      </Form>
      <Button block color="primary" onClick={handleConfirm}>
        确定
      </Button>
    </Popup>
  )
}
```

### 案例 3: 图片预览弹窗

```tsx
export function ImagePreviewPopup() {
  const [visible, setVisible] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const { setPopup, removePopup } = usePopupStore()

  useEffect(() => {
    setPopup(PopupNames.IMAGE_PREVIEW, { show: visible, setShow: setVisible })
    return () => removePopup(PopupNames.IMAGE_PREVIEW)
  }, [visible])

  return (
    <Popup
      visible={visible}
      bodyStyle={{ background: 'transparent' }}
      onMaskClick={() => setVisible(false)}
    >
      <img
        src={currentImage}
        style={{ width: '100%', height: 'auto' }}
        alt="预览"
      />
    </Popup>
  )
}

// 使用
import { useImagePreview } from '@/hooks'

const handlePreview = (imageUrl: string) => {
  setCurrentImage(imageUrl)
  popShow(PopupNames.IMAGE_PREVIEW)
}
```

## 调试技巧

### 查看当前打开的弹窗

```typescript
import { usePopup } from '@/hooks'

const { getOpenPopups } = usePopup()
console.log('当前打开的弹窗:', getOpenPopups())
```

### 查看所有注册的弹窗

```typescript
import { usePopupStore } from '@/store'

console.log('已注册的弹窗:', usePopupStore.getState().list)
```

### 添加调试日志

```typescript
// 在 usePopup 中已包含警告日志
// 弹窗未注册时会提示
// 重复打开/关闭时会提示
```

## 性能优化

### 1. 按需引入弹窗

```tsx
// ❌ 所有页面都引入
<AllPopups />

// ✅ 在需要的页面引入
function ProductPage() {
  return (
    <div>
      <ProductDetailPopup />
      <AddToCartPopup />
    </div>
  )
}
```

### 2. 懒加载弹窗

```tsx
const LazyPopup = lazy(() => import('./heavy-popup'))

<Suspense fallback={null}>
  {shouldShowPopup && <LazyPopup />}
</Suspense>
```

## 总结

1. **简单三步** - 定义名称 → 创建组件 → 使用 Hook
2. **类型安全** - 使用枚举避免错误
3. **全局控制** - 在任何地方都能控制
4. **功能完善** - 支持互斥、批量关闭等
5. **易于调试** - 完善的警告日志

**记住：弹窗管理让多弹窗场景变得简单！** 🎉

