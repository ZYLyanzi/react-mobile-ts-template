/**
 * API 使用示例
 * 展示如何使用封装好的axios实例
 */

import service from '@/services'
import type { ApiResponse } from '@/services'

// ==================== 类型定义 ====================

/** 用户信息 */
interface UserInfo {
  id: string
  username: string
  avatar: string
  email: string
}

/** 用户列表查询参数 */
interface UserListParams {
  page: number
  pageSize: number
  keyword?: string
}

/** 用户列表响应 */
interface UserListData {
  list: UserInfo[]
  total: number
}

// ==================== API 方法 ====================

/**
 * 示例1: 基础GET请求
 * 获取用户信息
 */
export function getUserInfo(userId: string) {
  return service.get<ApiResponse<UserInfo>>(`/user/${userId}`)
}

/**
 * 示例2: 带参数的GET请求
 * 获取用户列表
 */
export function getUserList(params: UserListParams) {
  return service.get<ApiResponse<UserListData>>('/user/list', {
    params,
  })
}

/**
 * 示例3: POST请求
 * 创建用户
 */
export function createUser(data: Partial<UserInfo>) {
  return service.post<ApiResponse<UserInfo>>('/user/create', data)
}

/**
 * 示例4: PUT请求
 * 更新用户信息
 */
export function updateUser(userId: string, data: Partial<UserInfo>) {
  return service.put<ApiResponse<UserInfo>>(`/user/${userId}`, data)
}

/**
 * 示例5: DELETE请求
 * 删除用户
 */
export function deleteUser(userId: string) {
  return service.delete<ApiResponse<null>>(`/user/${userId}`)
}

/**
 * 示例6: 禁用Loading的请求
 * 适用于轮询、后台请求等不需要显示loading的场景
 */
export function getUserInfoSilent(userId: string) {
  return service.get<ApiResponse<UserInfo>>(`/user/${userId}`, {
    // @ts-ignore - 扩展配置
    showLoading: false,
  })
}

/**
 * 示例7: 禁用错误提示的请求
 * 适用于需要自行处理错误的场景
 */
export function login(username: string, password: string) {
  return service.post<ApiResponse<{ token: string }>>(
    '/auth/login',
    { username, password },
    {
      // @ts-ignore - 扩展配置
      showError: false, // 不显示错误Toast，自行处理
    },
  )
}

/**
 * 示例8: 上传文件
 */
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return service.post<ApiResponse<{ url: string }>>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// ==================== 组件中使用示例 ====================

/**
 * 在组件中使用的示例代码：
 * 
 * ```tsx
 * import { useEffect, useState } from 'react'
 * import { getUserInfo, getUserList } from '@/api/example'
 * 
 * function UserProfile() {
 *   const [userInfo, setUserInfo] = useState(null)
 * 
 *   useEffect(() => {
 *     // 示例1: 基础使用
 *     getUserInfo('123').then(data => {
 *       setUserInfo(data) // data已经是解包后的数据，不需要data.data
 *     })
 * 
 *     // 示例2: 使用 async/await
 *     const fetchData = async () => {
 *       try {
 *         const data = await getUserInfo('123')
 *         setUserInfo(data)
 *       } catch (error) {
 *         // 错误已经被统一处理并Toast提示
 *         // 这里可以做额外的错误处理
 *         console.error(error)
 *       }
 *     }
 *     fetchData()
 * 
 *     // 示例3: 自定义错误处理
 *     login('username', 'password')
 *       .then(data => {
 *         console.log('登录成功', data.token)
 *       })
 *       .catch(error => {
 *         // showError: false 时需要自己处理错误
 *         Toast.show({ icon: 'fail', content: '登录失败' })
 *       })
 *   }, [])
 * 
 *   return <div>{userInfo?.username}</div>
 * }
 * ```
 */

