import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useLoadingStore, useUserStore } from '@/store';

import { cancelRequest } from '../cancel';

/**
 * 请求拦截器 - 成功处理
 */
export function requestInterceptorFulfilled(config: InternalAxiosRequestConfig) {
  // 1. 添加Token
  const token = useUserStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. 添加请求取消控制（防止重复请求）
  cancelRequest.addPending(config);

  // 3. 显示Loading（可通过config.showLoading控制）
  const showLoading = (config as any).showLoading !== false;
  if (showLoading) {
    useLoadingStore.getState().show?.();
  }

  // 4. 可以添加其他公共参数
  // 例如：添加时间戳防止缓存
  // if (config.method === 'get') {
  //   config.params = { ...config.params, _t: Date.now() }
  // }

  return config;
}

/**
 * 请求拦截器 - 错误处理
 */
export function requestInterceptorRejected(error: AxiosError) {
  // 隐藏Loading
  useLoadingStore.getState().hide?.();

  return Promise.reject(error);
}
