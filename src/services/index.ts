/**
 * Services 统一导出
 */

import axiosInstance from './service'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from './types'

// 导出axios实例（默认导出和命名导出）
export { default } from './service'
export { default as service } from './service'

// 导出类型定义
export type { ApiResponse, PageParams, PageData, RequestConfig } from './types'

// 导出请求取消控制（高级用法）
export { cancelRequest } from './cancel'

// 导出错误处理器（高级用法）
export {
  handleHttpError,
  handleBusinessError,
  handleNetworkError,
} from './error-handler'

// ==================== 便捷请求方法 ====================

/**
 * GET 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config axios配置
 */
export const GET = <T = any, P = Record<string, any>>(
  url: string,
  params?: P,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return axiosInstance
    .get<ApiResponse<T>>(url, { params, ...config })
    .then((res: any) => res)
    .catch((e) => Promise.reject(e))
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config axios配置
 */
export const POST = <T = any, P = Record<string, any>>(
  url: string,
  data?: P,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return axiosInstance
    .post<ApiResponse<T>>(url, data, config)
    .then((res: any) => res)
    .catch((e) => Promise.reject(e))
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config axios配置
 */
export const PUT = <T = any, P = Record<string, any>>(
  url: string,
  data?: P,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return axiosInstance
    .put<ApiResponse<T>>(url, data, config)
    .then((res: any) => res)
    .catch((e) => Promise.reject(e))
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config axios配置
 */
export const DELETE = <T = any, P = Record<string, any>>(
  url: string,
  params?: P,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return axiosInstance
    .delete<ApiResponse<T>>(url, { params, ...config })
    .then((res: any) => res)
    .catch((e) => Promise.reject(e))
}
