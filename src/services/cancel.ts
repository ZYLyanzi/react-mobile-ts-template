import type { InternalAxiosRequestConfig } from 'axios'

/**
 * 请求取消控制类
 * 用于防止重复请求
 */
class CancelRequest {
  /** 存储pending请求的Map */
  private pendingMap = new Map<string, AbortController>()

  /**
   * 生成请求的唯一key
   * 根据请求方法、URL、参数、数据生成
   */
  private getRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  /**
   * 添加pending请求
   * 如果已存在相同的请求，则取消之前的请求
   */
  addPending(config: InternalAxiosRequestConfig) {
    // 先移除之前的重复请求
    this.removePending(config)

    const requestKey = this.getRequestKey(config)
    const controller = new AbortController()

    // 设置取消信号
    config.signal = controller.signal

    // 存储到pending列表
    this.pendingMap.set(requestKey, controller)
  }

  /**
   * 移除pending请求
   */
  removePending(config: InternalAxiosRequestConfig) {
    const requestKey = this.getRequestKey(config)
    const controller = this.pendingMap.get(requestKey)

    if (controller) {
      // 取消请求
      controller.abort()
      // 从列表中删除
      this.pendingMap.delete(requestKey)
    }
  }

  /**
   * 清空所有pending请求
   */
  clearPending() {
    this.pendingMap.forEach((controller) => {
      controller.abort()
    })
    this.pendingMap.clear()
  }

  /**
   * 获取pending请求数量
   */
  getPendingCount(): number {
    return this.pendingMap.size
  }
}

// 导出单例
export const cancelRequest = new CancelRequest()

