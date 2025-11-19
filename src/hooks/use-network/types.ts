/**
 * 网络状态信息
 */
export interface NetworkInfo {
  /** 是否在线 */
  online: boolean;
  /** 网络类型 */
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  /** 下行速度（Mbps） */
  downlink?: number;
  /** 往返时间（ms） */
  rtt?: number;
  /** 是否启用数据节省模式 */
  saveData?: boolean;
}

/**
 * useNetwork Hook 配置选项
 */
export interface UseNetworkOptions {
  /** 网络状态变化回调 */
  onChange?: (info: NetworkInfo) => void;
  /** 离线回调 */
  onOffline?: () => void;
  /** 在线回调 */
  onOnline?: () => void;
}
