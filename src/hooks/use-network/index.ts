import { useEffect, useState } from 'react';

import type { NetworkInfo, UseNetworkOptions } from './types';

/**
 * 获取网络连接信息（如果支持）
 */
function getConnection(): any {
  const nav = navigator as any;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

/**
 * 获取当前网络状态
 */
function getNetworkInfo(): NetworkInfo {
  const connection = getConnection();

  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
}

/**
 * 网络状态 Hook
 *
 * 监听网络状态变化（在线/离线、网络类型等）
 *
 * @param options 配置选项
 * @returns 网络状态信息
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const network = useNetwork({
 *     onOffline: () => {
 *       Toast.show('网络已断开')
 *     },
 *     onOnline: () => {
 *       Toast.show('网络已连接')
 *     },
 *   })
 *
 *   if (!network.online) {
 *     return <div>网络已断开，请检查网络连接</div>
 *   }
 *
 *   return (
 *     <div>
 *       <p>网络类型: {network.effectiveType}</p>
 *       <p>下行速度: {network.downlink} Mbps</p>
 *     </div>
 *   )
 * }
 *
 * // 根据网络状态调整图片质量
 * function ImageComponent() {
 *   const { effectiveType } = useNetwork()
 *
 *   const imageQuality = effectiveType === '4g' ? 'high' : 'low'
 *
 *   return <img src={`/image-${imageQuality}.jpg`} />
 * }
 * ```
 */
export function useNetwork(options: UseNetworkOptions = {}): NetworkInfo {
  const { onChange, onOffline, onOnline } = options;
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(getNetworkInfo);

  useEffect(() => {
    const updateNetworkInfo = () => {
      const info = getNetworkInfo();
      setNetworkInfo(info);
      onChange?.(info);
    };

    const handleOnline = () => {
      updateNetworkInfo();
      onOnline?.();
    };

    const handleOffline = () => {
      updateNetworkInfo();
      onOffline?.();
    };

    // 监听在线/离线状态
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 监听网络变化（如果支持）
    const connection = getConnection();
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, [onChange, onOffline, onOnline]);

  return networkInfo;
}
