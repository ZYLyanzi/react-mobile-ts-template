# 🔌 API 请求使用指南

## 快速上手

### 基础使用

```typescript
import service from '@/services'

// GET 请求
const data = await service.get('/api/user/123')

// POST 请求
const result = await service.post('/api/user/create', {
  username: 'zhangsan',
  email: 'zhangsan@example.com'
})
```

## 核心特性

### ✅ 自动处理

1. **自动添加 Token**：请求头自动携带 Authorization
2. **自动显示 Loading**：请求时显示，完成后隐藏
3. **自动错误提示**：使用 antd-mobile Toast 显示错误
4. **防止重复请求**：相同请求会自动取消前一个
5. **统一数据解包**：返回 data 字段，不需要 `response.data.data`

### ⚙️ 配置选项

```typescript
service.get('/api/user', {
  // @ts-ignore
  showLoading: false,  // 不显示 Loading
  showError: false,    // 不显示错误 Toast
})
```

## 完整示例

### 1. 定义API

```typescript
// src/api/user.ts
import service from '@/services'
import type { ApiResponse } from '@/services'

interface UserInfo {
  id: string
  username: string
  avatar: string
}

// 获取用户信息
export function getUserInfo(userId: string) {
  return service.get<ApiResponse<UserInfo>>(`/user/${userId}`)
}

// 更新用户信息
export function updateUser(userId: string, data: Partial<UserInfo>) {
  return service.put<ApiResponse<UserInfo>>(`/user/${userId}`, data)
}
```

### 2. 组件中使用

```tsx
import { useEffect, useState } from 'react'
import { getUserInfo, updateUser } from '@/api/user'
import { Button, Toast } from 'antd-mobile'

function UserProfile() {
  const [user, setUser] = useState(null)

  // 获取数据
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ 自动显示Loading
        // ✅ 自动添加Token
        // ✅ 错误自动Toast提示
        const data = await getUserInfo('123')
        setUser(data) // data 已经解包，直接使用
      } catch (error) {
        // 错误已统一处理，这里可选处理
        console.error(error)
      }
    }
    fetchUser()
  }, [])

  // 更新数据
  const handleUpdate = async () => {
    try {
      await updateUser('123', { username: '新名字' })
      Toast.show({ icon: 'success', content: '更新成功' })
    } catch (error) {
      // 错误会自动Toast提示
    }
  }

  return (
    <div>
      <p>{user?.username}</p>
      <Button onClick={handleUpdate}>更新</Button>
    </div>
  )
}
```

## 高级用法

### 1. 禁用 Loading

适用于轮询、后台请求等场景：

```typescript
// 静默请求，不显示Loading
service.get('/api/status', {
  // @ts-ignore
  showLoading: false
})
```

### 2. 自定义错误处理

```typescript
// 禁用自动错误提示，自行处理
const login = async () => {
  try {
    const data = await service.post('/api/login', credentials, {
      // @ts-ignore
      showError: false
    })
    Toast.show({ icon: 'success', content: '登录成功' })
  } catch (error: any) {
    // 自定义错误处理
    if (error.code === 401) {
      Toast.show({ icon: 'fail', content: '用户名或密码错误' })
    }
  }
}
```

### 3. 文件上传

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const result = await service.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return result.url
}
```

### 4. 下载文件

```typescript
const downloadFile = async (fileId: string) => {
  const response = await service.get(`/api/file/${fileId}`, {
    responseType: 'blob',
    // @ts-ignore
    showLoading: true,
    showError: false
  })

  // 创建下载链接
  const url = window.URL.createObjectURL(new Blob([response]))
  const link = document.createElement('a')
  link.href = url
  link.download = 'filename.pdf'
  link.click()
}
```

### 5. 取消请求

```typescript
import { cancelRequest } from '@/services'

// 清空所有pending请求
cancelRequest.clearPending()

// 查看pending请求数量
const count = cancelRequest.getPendingCount()
```

## 错误处理

### 自动处理的错误

| 状态码 | 说明 | 处理方式 |
|--------|------|---------|
| 400 | 请求参数错误 | Toast 提示 |
| 401 | 未授权/登录过期 | Toast + 跳转登录页 |
| 403 | 无权限 | Toast 提示 |
| 404 | 资源不存在 | Toast 提示 |
| 500 | 服务器错误 | Toast 提示 |
| 502/503 | 网关/服务错误 | Toast 提示 |
| Network Error | 网络错误 | Toast 提示 |
| timeout | 请求超时 | Toast 提示 |

### 白名单机制

某些接口不需要显示错误提示，可以添加到白名单：

```typescript
// src/services/error-handler.ts
const errorWhiteList = [
  '/api/login',           // 登录接口
  '/api/refresh-token',   // 刷新token
]
```

## 响应数据格式

### 标准格式

后端接口应遵循以下格式：

```json
{
  "code": 200,        // 业务状态码
  "data": { ... },    // 实际数据
  "message": "成功"   // 提示信息
}
```

### 前端使用

```typescript
// ❌ 不需要这样写
const response = await service.get('/api/user')
const data = response.data.data  // 繁琐

// ✅ 直接使用data
const data = await service.get('/api/user')  // 已自动解包
console.log(data.username)
```

## 最佳实践

### ✅ 推荐做法

```typescript
// 1. 统一管理API
// src/api/user.ts
export const userApi = {
  getInfo: (id: string) => service.get(`/user/${id}`),
  update: (id: string, data: any) => service.put(`/user/${id}`, data),
  delete: (id: string) => service.delete(`/user/${id}`)
}

// 2. 使用类型定义
interface User {
  id: string
  name: string
}

export function getUser(id: string) {
  return service.get<ApiResponse<User>>(`/user/${id}`)
}

// 3. 错误处理
try {
  const data = await getUser('123')
  // 成功处理
} catch (error) {
  // 错误已自动Toast，这里只需特殊处理
}
```

### ❌ 不推荐做法

```typescript
// ❌ 直接在组件中写axios
axios.get('/api/user').then(res => {
  // 没有统一处理
})

// ❌ 每个请求都手动处理loading
setLoading(true)
await service.get('/api/user')
setLoading(false)  // 已自动处理

// ❌ 不处理错误
service.get('/api/user')  // 错误会被吞掉
```

## 配置说明

### 环境变量

```bash
# .env.dev
VITE_API_BASE_URL=/api
VITE_SERVER_URL=https://dev-api.example.com
```

### 超时时间

默认 10 秒，可在 `src/services/service.ts` 中修改：

```typescript
const axiosInstance = axios.create({
  timeout: 10000, // 10秒
})
```

## 常见问题

### Q1: 如何关闭某个请求的Loading？

```typescript
service.get('/api/data', {
  // @ts-ignore
  showLoading: false
})
```

### Q2: 如何自定义错误处理？

```typescript
// 方法1：禁用自动错误提示
service.post('/api/login', data, {
  // @ts-ignore
  showError: false
}).catch(error => {
  // 自定义处理
})

// 方法2：添加到白名单
// 修改 src/services/error-handler.ts
```

### Q3: Token 从哪里来？

Token 从 `useUserStore` 中获取，需要先设置：

```typescript
import { useUserStore } from '@/store'

// 登录成功后设置token
useUserStore.getState().updateToken(token)
```

### Q4: 如何处理并发请求？

Loading 自动处理并发：

```typescript
// 同时发起3个请求
const [user, posts, comments] = await Promise.all([
  getUser('123'),
  getPosts('123'),
  getComments('123')
])
// Loading会等所有请求完成后才隐藏
```

### Q5: 如何mock数据？

```typescript
// 方法1：使用条件判断
if (import.meta.env.DEV) {
  return Promise.resolve(mockData)
}

// 方法2：使用 MSW (Mock Service Worker)
// 推荐在项目中集成MSW
```

## 总结

1. **简单易用** - 自动处理Token、Loading、错误
2. **类型安全** - 完整的TypeScript类型支持
3. **灵活配置** - 可按需禁用自动功能
4. **防重复请求** - 自动取消重复请求
5. **统一规范** - 团队开发更高效

**记住：直接用就行了，大部分情况不需要特殊处理！** 🎉

