import type { AxiosResponse, AxiosError } from 'axios'
import { cancelRequest } from '../cancel'
import { handleHttpError, handleBusinessError, handleNetworkError } from '../error-handler'
import type { ApiResponse } from '../types'
import { useLoadingStore } from '@/store'

/**
 * 响应拦截器 - 成功处理
 */
export function responseInterceptorFulfilled(response: AxiosResponse<ApiResponse>) {
  // 1. 移除pending请求
  cancelRequest.removePending(response.config)

  // 2. 隐藏Loading
  useLoadingStore.getState().hide?.()

  // 3. 处理响应数据
  const { code, data, message } = response.data

  // 3.1 成功响应（根据实际后端约定调整）
  if (code === 200 || code === 0) {
    return data // 直接返回data，简化使用
  }

  // 3.2 业务错误处理
  const showError = (response.config as any).showError !== false
  if (showError) {
    handleBusinessError(code, message, response.config.url)
  }

  // 返回Promise.reject，让调用方可以catch
  return Promise.reject(response.data)
}

/**
 * 响应拦截器 - 错误处理
 */
export function responseInterceptorRejected(error: AxiosError) {
  // 1. 隐藏Loading
  useLoadingStore.getState().hide?.()

  // 2. 取消请求不提示
  if (error.code === 'ERR_CANCELED') {
    console.log('请求已取消:', error.config?.url)
    return Promise.reject(error)
  }

  // 3. 网络错误
  if (!error.response) {
    handleNetworkError(error.message)
    return Promise.reject(error)
  }

  // 4. HTTP状态码错误
  const { status } = error.response
  const showError = (error.config as any)?.showError !== false
  if (showError) {
    handleHttpError(status, error.message, error.config?.url)
  }

  return Promise.reject(error)
}

