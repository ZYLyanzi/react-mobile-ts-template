import type { AxiosRequestConfig } from 'axios'

/**
 * 通用API响应结构
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
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示loading */
  showLoading?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 是否可取消（防止重复请求） */
  cancelable?: boolean
}

