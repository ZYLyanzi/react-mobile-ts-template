/**
 * 移动端工具函数
 * 设备判断、环境检测等
 */

/**
 * 获取 User Agent
 */
export function getUserAgent(): string {
  return navigator.userAgent.toLowerCase();
}

/**
 * 判断是否为 iOS 设备
 */
export function isIOS(): boolean {
  const ua = getUserAgent();
  return /iphone|ipad|ipod/i.test(ua);
}

/**
 * 判断是否为 Android 设备
 */
export function isAndroid(): boolean {
  const ua = getUserAgent();
  return /android/i.test(ua);
}

/**
 * 判断是否为移动设备
 */
export function isMobile(): boolean {
  return isIOS() || isAndroid();
}

/**
 * 判断是否为微信浏览器
 */
export function isWechat(): boolean {
  const ua = getUserAgent();
  return /micromessenger/i.test(ua);
}

/**
 * 判断是否为微信小程序
 */
export function isMiniProgram(): boolean {
  const ua = getUserAgent();
  return /miniprogram/i.test(ua);
}

/**
 * 判断是否为QQ浏览器
 */
export function isQQ(): boolean {
  const ua = getUserAgent();
  return /qq\//i.test(ua);
}

/**
 * 判断是否为支付宝
 */
export function isAlipay(): boolean {
  const ua = getUserAgent();
  return /alipay/i.test(ua);
}

/**
 * 判断是否为钉钉
 */
export function isDingTalk(): boolean {
  const ua = getUserAgent();
  return /dingtalk/i.test(ua);
}

/**
 * 判断是否在 App 内（需要自定义 UA 标识）
 */
export function isApp(appName = 'YourApp'): boolean {
  const ua = getUserAgent();
  return new RegExp(appName, 'i').test(ua);
}

/**
 * 获取 iOS 版本
 */
export function getIOSVersion(): string | null {
  if (!isIOS()) return null;

  const ua = getUserAgent();
  const match = ua.match(/os (\d+)_(\d+)_?(\d+)?/);

  if (match) {
    return `${match[1]}.${match[2]}.${match[3] || 0}`;
  }

  return null;
}

/**
 * 获取 Android 版本
 */
export function getAndroidVersion(): string | null {
  if (!isAndroid()) return null;

  const ua = getUserAgent();
  const match = ua.match(/android (\d+(\.\d+)?)/i);

  if (match) {
    return match[1];
  }

  return null;
}

/**
 * 获取微信版本
 */
export function getWechatVersion(): string | null {
  if (!isWechat()) return null;

  const ua = getUserAgent();
  const match = ua.match(/micromessenger\/(\d+\.\d+\.\d+)/i);

  if (match) {
    return match[1];
  }

  return null;
}

/**
 * 获取设备信息
 */
export interface DeviceInfo {
  /** 是否为iOS */
  isIOS: boolean;
  /** 是否为Android */
  isAndroid: boolean;
  /** 是否为移动设备 */
  isMobile: boolean;
  /** 是否为微信 */
  isWechat: boolean;
  /** 是否为微信小程序 */
  isMiniProgram: boolean;
  /** 是否为QQ */
  isQQ: boolean;
  /** 是否为支付宝 */
  isAlipay: boolean;
  /** 是否为钉钉 */
  isDingTalk: boolean;
  /** 系统版本 */
  osVersion: string | null;
  /** 微信版本 */
  wechatVersion: string | null;
  /** User Agent */
  userAgent: string;
}

/**
 * 获取完整的设备信息
 */
export function getDeviceInfo(): DeviceInfo {
  const ios = isIOS();
  const android = isAndroid();

  return {
    isIOS: ios,
    isAndroid: android,
    isMobile: isMobile(),
    isWechat: isWechat(),
    isMiniProgram: isMiniProgram(),
    isQQ: isQQ(),
    isAlipay: isAlipay(),
    isDingTalk: isDingTalk(),
    osVersion: ios ? getIOSVersion() : android ? getAndroidVersion() : null,
    wechatVersion: getWechatVersion(),
    userAgent: getUserAgent(),
  };
}

/**
 * 调用 App 方法（JSBridge）
 * @param method 方法名
 * @param params 参数
 */
export function callAppMethod(method: string, params?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    // 检查是否在 App 内
    if (!isApp()) {
      reject(new Error('当前不在 App 环境中'));
      return;
    }

    // 根据实际的 JSBridge 实现调整
    const bridge = (window as any).AppBridge;

    if (!bridge) {
      reject(new Error('JSBridge 未初始化'));
      return;
    }

    try {
      bridge.call(method, params, (result: any) => {
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    return false;
  }
}

/**
 * 调用系统分享
 */
export async function systemShare(data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * 震动反馈
 * @param pattern 震动模式（毫秒）
 */
export function vibrate(pattern: number | number[] = 10): boolean {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
