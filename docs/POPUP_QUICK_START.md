# 🚀 弹窗管理 - 快速上手

## 三步使用弹窗

### 第一步：定义弹窗名称

```typescript
// src/constants/popup-names.ts
export enum PopupNames {
  MY_POPUP = 'MY_POPUP', // 添加你的弹窗名称
}
```

### 第二步：创建弹窗组件

```tsx
// src/components/popups/my-popup.tsx
import { useEffect, useState } from 'react'
import { Popup, Button } from 'antd-mobile'
import { usePopupStore } from '@/store'
import { PopupNames } from '@/constants'

export function MyPopup() {
  const [visible, setVisible] = useState(false)
  const { setPopup, removePopup } = usePopupStore()

  useEffect(() => {
    setPopup(PopupNames.MY_POPUP, {
      show: visible,
      setShow: setVisible,
    })
    return () => removePopup(PopupNames.MY_POPUP)
  }, [visible])

  return (
    <Popup visible={visible} onMaskClick={() => setVisible(false)}>
      <div style={{ padding: '40px' }}>
        <h3>我的弹窗</h3>
        <Button onClick={() => setVisible(false)}>关闭</Button>
      </div>
    </Popup>
  )
}
```

### 第三步：使用弹窗

```tsx
// 在页面中引入弹窗组件
import { MyPopup } from '@/components/popups'
import { usePopup } from '@/hooks'
import { PopupNames } from '@/constants'

function MyPage() {
  const { popShow } = usePopup()

  return (
    <div>
      {/* 触发按钮 */}
      <button onClick={() => popShow(PopupNames.MY_POPUP)}>
        打开弹窗
      </button>

      {/* 弹窗组件 */}
      <MyPopup />
    </div>
  )
}
```

## 完成！🎉

就这么简单！现在你可以：

```typescript
const { popShow, popClose, popCloseAll } = usePopup()

// 打开弹窗
popShow(PopupNames.MY_POPUP)

// 关闭弹窗
popClose(PopupNames.MY_POPUP)

// 关闭所有弹窗
popCloseAll()
```

## 查看示例

访问 `/examples/popup-demo` 查看完整的弹窗演示页面。

## 更多功能

查看 [完整文档](./POPUP_MANAGE_USAGE.md) 了解：
- 高级用法
- 最佳实践
- 实战案例
- 常见问题

