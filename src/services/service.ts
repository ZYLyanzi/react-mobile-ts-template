import axios, { AxiosInstance } from 'axios'
import {
  requestInterceptorFulfilled,
  requestInterceptorRejected,
  responseInterceptorFulfilled,
  responseInterceptorRejected,
} from './interceptors'

/**
 * 创建axios实例
 * 移动端H5项目配置
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API基础路径
  timeout: 10000, // 请求超时时间：10s
  headers: {
    'Content-Type': 'application/json', // 默认JSON格式
  },
})

/**
 * 应用请求拦截器
 * 功能：添加Token、请求取消控制、显示Loading
 */
axiosInstance.interceptors.request.use(
  requestInterceptorFulfilled,
  requestInterceptorRejected,
)

/**
 * 应用响应拦截器
 * 功能：处理响应数据、错误统一处理、隐藏Loading
 */
axiosInstance.interceptors.response.use(
  responseInterceptorFulfilled,
  responseInterceptorRejected,
)

// 导出配置好的axios实例
export default axiosInstance
