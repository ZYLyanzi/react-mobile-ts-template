# 🛠 工具函数使用指南

## 移动端工具 (mobile.ts)

### 设备判断

```typescript
import { isIOS, isAndroid, isMobile, isWechat } from '@/utils'

// 判断设备类型
if (isIOS()) {
  console.log('iOS 设备')
}

if (isAndroid()) {
  console.log('Android 设备')
}

if (isMobile()) {
  console.log('移动设备')
}

// 判断环境
if (isWechat()) {
  console.log('微信浏览器')
}

// 其他环境检测
import { isMiniProgram, isQQ, isAlipay, isDingTalk } from '@/utils'
```

### 获取设备信息

```typescript
import { getDeviceInfo } from '@/utils'

const deviceInfo = getDeviceInfo()
console.log(deviceInfo)
/*
{
  isIOS: true,
  isAndroid: false,
  isMobile: true,
  isWechat: true,
  osVersion: '15.0.0',
  wechatVersion: '8.0.0',
  userAgent: '...'
}
*/
```

### 系统功能

```typescript
import { copyToClipboard, systemShare, vibrate } from '@/utils'

// 复制文本
const success = await copyToClipboard('复制内容')
if (success) {
  Toast.show('复制成功')
}

// 系统分享
await systemShare({
  title: '分享标题',
  text: '分享内容',
  url: 'https://example.com'
})

// 震动反馈
vibrate(10) // 震动10ms
vibrate([100, 50, 100]) // 震动模式
```

## 存储工具 (storage.ts)

### 基础使用

```typescript
import { storage } from '@/utils'

// 设置数据
storage.set('user', { name: '张三', age: 18 })

// 获取数据
const user = storage.get('user')

// 删除数据
storage.remove('user')

// 清空所有数据
storage.clear()

// 检查是否存在
if (storage.has('user')) {
  console.log('存在')
}
```

### 带过期时间

```typescript
import { storage, setWithExpire } from '@/utils'

// 设置30分钟后过期
storage.set('token', 'xxx', 30 * 60 * 1000)

// 或使用便捷方法（分钟）
setWithExpire('token', 'xxx', 30)

// 获取时自动检查过期
const token = storage.get('token') // 过期返回 null
```

### 高级功能

```typescript
import { storage, getOnce, setMultiple, getMultiple } from '@/utils'

// 获取后删除（一次性数据）
const tempData = getOnce('tempData')

// 批量设置
setMultiple({
  user: { name: '张三' },
  token: 'xxx',
  settings: { theme: 'dark' }
})

// 批量获取
const data = getMultiple(['user', 'token', 'settings'])

// 查看存储大小
const size = storage.getSize() // 字节
const remaining = storage.getRemainingSpace() // 剩余空间
```

### 使用 SessionStorage

```typescript
import { sessionStorage } from '@/utils'

// 用法与 storage 相同，但数据在关闭标签页后清除
sessionStorage.set('tempData', { ... })
```

## URL 工具 (url.ts)

### 解析 URL 参数

```typescript
import { parseUrlParams, getUrlParam } from '@/utils'

// URL: https://example.com?name=张三&age=18

// 获取所有参数
const params = parseUrlParams()
// { name: '张三', age: '18' }

// 获取单个参数
const name = getUrlParam('name') // '张三'
const id = getUrlParam('id')    // null
```

### 构建 URL

```typescript
import { buildUrlParams, addUrlParams } from '@/utils'

// 构建参数字符串
const paramStr = buildUrlParams({ name: '张三', age: 18 })
// 'name=张三&age=18'

// 添加参数到 URL
const url = addUrlParams('/api/user', { id: 123, type: 'detail' })
// '/api/user?id=123&type=detail'
```

### 更新浏览器 URL（不刷新）

```typescript
import { updateUrlParams } from '@/utils'

// 更新参数（pushState）
updateUrlParams({ page: 2, sort: 'time' })
// URL 变为: ?page=2&sort=time

// 替换参数（replaceState）
updateUrlParams({ page: 3 }, true)
```

### 其他工具

```typescript
import { isExternalLink, getDomain, joinPath } from '@/utils'

// 判断外部链接
isExternalLink('https://example.com') // true
isExternalLink('/api/user') // false

// 获取域名
getDomain('https://example.com/path') // 'example.com'

// 拼接路径
joinPath('/api', 'user', '123') // '/api/user/123'
```

## 验证工具 (validate.ts)

### 常用验证

```typescript
import {
  isPhone,
  isEmail,
  isIdCard,
  isUrl,
  isEmpty
} from '@/utils'

// 手机号
isPhone('13800138000') // true
isPhone('12345678901') // false

// 邮箱
isEmail('user@example.com') // true

// 身份证
isIdCard('110101199001011234') // true

// URL
isUrl('https://example.com') // true

// 是否为空
isEmpty('') // true
isEmpty([]) // true
isEmpty({}) // true
isEmpty(null) // true
```

### 密码强度验证

```typescript
import { isPassword } from '@/utils'

// 等级1：至少6位
isPassword('123456', 1) // true

// 等级2：至少6位，包含数字和字母
isPassword('abc123', 2) // true
isPassword('123456', 2) // false

// 等级3：至少8位，包含数字、字母、特殊字符
isPassword('Abc123!@', 3) // true
isPassword('abc123', 3) // false
```

### 格式验证

```typescript
import {
  isChinese,
  isEnglish,
  isNumber,
  isInteger,
  isAlphanumeric
} from '@/utils'

isChinese('张三') // true
isEnglish('John') // true
isNumber('123') // true
isInteger('123') // true
isAlphanumeric('abc123') // true
```

### 范围验证

```typescript
import { isLengthInRange, isNumberInRange } from '@/utils'

// 长度范围
isLengthInRange('hello', 3, 10) // true

// 数值范围
isNumberInRange(5, 1, 10) // true
```

### 在表单中使用

```typescript
import { Form, Input, Button, Toast } from 'antd-mobile'
import { isPhone, isEmail, isEmpty } from '@/utils'

function MyForm() {
  const [form] = Form.useForm()

  const handleSubmit = (values: any) => {
    // 验证手机号
    if (!isPhone(values.phone)) {
      Toast.show('请输入正确的手机号')
      return
    }

    // 验证邮箱
    if (!isEmail(values.email)) {
      Toast.show('请输入正确的邮箱')
      return
    }

    // 验证非空
    if (isEmpty(values.name)) {
      Toast.show('姓名不能为空')
      return
    }

    // 提交表单
    submitForm(values)
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="phone" label="手机号">
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Button block type="submit" color="primary">
        提交
      </Button>
    </Form>
  )
}
```

## 实战案例

### 案例 1: 根据设备加载不同资源

```typescript
import { isIOS, isAndroid } from '@/utils'

function getAppDownloadUrl() {
  if (isIOS()) {
    return 'https://apps.apple.com/...'
  } else if (isAndroid()) {
    return 'https://play.google.com/...'
  }
  return 'https://example.com'
}
```

### 案例 2: 微信分享配置

```typescript
import { isWechat, getWechatVersion } from '@/utils'

function setupWechatShare() {
  if (!isWechat()) {
    return
  }

  const version = getWechatVersion()
  console.log('微信版本:', version)

  // 配置微信分享
  // wx.config({ ... })
}
```

### 案例 3: 表单验证

```typescript
import { isPhone, isEmail, isPassword } from '@/utils'

const validateForm = (values: any) => {
  const errors: any = {}

  if (!isPhone(values.phone)) {
    errors.phone = '请输入正确的手机号'
  }

  if (!isEmail(values.email)) {
    errors.email = '请输入正确的邮箱'
  }

  if (!isPassword(values.password, 2)) {
    errors.password = '密码至少6位，需包含数字和字母'
  }

  return errors
}
```

### 案例 4: 缓存管理

```typescript
import { storage } from '@/utils'

// 缓存用户信息（30分钟过期）
const cacheUserInfo = (userInfo: any) => {
  storage.set('userInfo', userInfo, 30 * 60 * 1000)
}

// 获取缓存
const getCachedUserInfo = () => {
  return storage.get('userInfo') // 过期自动返回 null
}

// 清除所有缓存
const clearAllCache = () => {
  storage.clear()
}
```

### 案例 5: URL 状态管理

```typescript
import { parseUrlParams, updateUrlParams } from '@/utils'

// 从 URL 恢复状态
function restoreStateFromUrl() {
  const params = parseUrlParams()
  setPage(Number(params.page) || 1)
  setSort(params.sort || 'time')
}

// 更新 URL（不刷新页面）
function updatePageState(page: number) {
  setPage(page)
  updateUrlParams({ page })
}
```

## 最佳实践

### ✅ 推荐做法

```typescript
// 1. 使用类型安全的验证
const phone: string = '13800138000'
if (isPhone(phone)) {
  // TypeScript 知道这里 phone 是有效的
}

// 2. 组合使用多个工具
import { isWechat, storage, copyToClipboard } from '@/utils'

if (isWechat()) {
  const token = storage.get('wechat_token')
  if (token) {
    copyToClipboard(token)
  }
}

// 3. 使用带过期时间的存储
storage.set('tempData', data, 5 * 60 * 1000) // 5分钟后过期
```

### ❌ 不推荐做法

```typescript
// ❌ 不要重复判断
if (isIOS()) {
  // ...
}
if (isAndroid()) {
  // ...
}
// 应该用 else if

// ❌ 不要在循环中调用
list.forEach(() => {
  const deviceInfo = getDeviceInfo() // 每次都获取
})
// 应该在循环外获取一次

// ❌ 不要忽略错误
copyToClipboard('text') // 没有处理失败情况
// 应该检查返回值
```

## 总结

工具函数涵盖：
- ✅ 设备和环境检测
- ✅ 本地存储（支持过期）
- ✅ URL 参数处理
- ✅ 数据验证（手机、邮箱等）
- ✅ 系统功能（复制、分享、震动）

**记住：善用工具函数，提高开发效率！** 🎉

