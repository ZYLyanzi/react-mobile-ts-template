/**
 * 滚动信息
 */
export interface ScrollInfo {
  /** 滚动的X坐标 */
  scrollX: number;
  /** 滚动的Y坐标 */
  scrollY: number;
  /** 是否正在滚动 */
  isScrolling: boolean;
  /** 滚动方向 */
  direction: 'up' | 'down' | 'left' | 'right' | null;
}

/**
 * useScroll Hook 配置选项
 */
export interface UseScrollOptions {
  /** 目标元素（默认为 window） */
  target?: HTMLElement | Window | null;
  /** 滚动回调 */
  onScroll?: (info: ScrollInfo) => void;
  /** 滚动到顶部回调 */
  onReachTop?: () => void;
  /** 滚动到底部回调 */
  onReachBottom?: () => void;
  /** 距离底部多少px时触发（默认100） */
  bottomOffset?: number;
  /** 节流延迟（ms，默认100） */
  throttle?: number;
}
