import { Toast } from 'antd-mobile'
import { useUserStore } from '@/store'

/**
 * 错误处理白名单
 * 这些接口的错误不会显示Toast提示
 */
const errorWhiteList = ['/api/login', '/api/refresh-token']

/**
 * 检查URL是否在白名单中
 */
function isInWhiteList(url?: string): boolean {
  if (!url) return false
  return errorWhiteList.some((whiteUrl) => url.includes(whiteUrl))
}

/**
 * HTTP状态码错误处理
 */
export function handleHttpError(status: number, message?: string, url?: string) {
  // 检查白名单
  if (isInWhiteList(url)) {
    return
  }

  switch (status) {
    case 400:
      Toast.show({
        icon: 'fail',
        content: message || '请求参数错误',
      })
      break
    case 401:
      Toast.show({
        icon: 'fail',
        content: '登录已过期，请重新登录',
      })
      // 清除token
      useUserStore.getState().clearToken?.()
      // 延迟跳转登录页
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
      break
    case 403:
      Toast.show({
        icon: 'fail',
        content: '没有权限访问',
      })
      break
    case 404:
      Toast.show({
        icon: 'fail',
        content: '请求的资源不存在',
      })
      break
    case 500:
      Toast.show({
        icon: 'fail',
        content: '服务器错误',
      })
      break
    case 502:
      Toast.show({
        icon: 'fail',
        content: '网关错误',
      })
      break
    case 503:
      Toast.show({
        icon: 'fail',
        content: '服务不可用',
      })
      break
    case 504:
      Toast.show({
        icon: 'fail',
        content: '网关超时',
      })
      break
    default:
      Toast.show({
        icon: 'fail',
        content: message || '请求失败',
      })
  }
}

/**
 * 业务错误码处理
 */
export function handleBusinessError(code: number, message: string, url?: string) {
  // 检查白名单
  if (isInWhiteList(url)) {
    return
  }

  // 根据实际业务错误码处理
  switch (code) {
    case 401:
      Toast.show({
        icon: 'fail',
        content: '登录已过期，请重新登录',
      })
      useUserStore.getState().clearToken?.()
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
      break
    case 403:
      Toast.show({
        icon: 'fail',
        content: '没有权限',
      })
      break
    default:
      // 显示后端返回的错误信息
      if (message) {
        Toast.show({
          icon: 'fail',
          content: message,
        })
      }
  }
}

/**
 * 网络错误处理
 */
export function handleNetworkError(message: string) {
  if (message.includes('Network Error')) {
    Toast.show({
      icon: 'fail',
      content: '网络连接失败，请检查网络',
    })
  } else if (message.includes('timeout')) {
    Toast.show({
      icon: 'fail',
      content: '请求超时，请重试',
    })
  } else {
    Toast.show({
      icon: 'fail',
      content: '网络异常，请重试',
    })
  }
}

