/**
 * 触摸位置信息
 */
export interface TouchPosition {
  /** 起始X坐标 */
  startX: number;
  /** 起始Y坐标 */
  startY: number;
  /** 结束X坐标 */
  endX: number;
  /** 结束Y坐标 */
  endY: number;
  /** X轴移动距离 */
  deltaX: number;
  /** Y轴移动距离 */
  deltaY: number;
}

/**
 * useTouch Hook 配置选项
 */
export interface UseTouchOptions {
  /** 向左滑动回调 */
  onSwipeLeft?: () => void;
  /** 向右滑动回调 */
  onSwipeRight?: () => void;
  /** 向上滑动回调 */
  onSwipeUp?: () => void;
  /** 向下滑动回调 */
  onSwipeDown?: () => void;
  /** 滑动距离阈值（默认50px） */
  threshold?: number;
  /** 触摸开始回调 */
  onTouchStart?: (position: TouchPosition) => void;
  /** 触摸移动回调 */
  onTouchMove?: (position: TouchPosition) => void;
  /** 触摸结束回调 */
  onTouchEnd?: (position: TouchPosition) => void;
}

/**
 * useTouch Hook 返回类型
 */
export interface UseTouchReturn {
  /** 触摸位置信息 */
  position: TouchPosition;
  /** 触摸开始处理函数 */
  handleTouchStart: (e: TouchEvent | React.TouchEvent) => void;
  /** 触摸移动处理函数 */
  handleTouchMove: (e: TouchEvent | React.TouchEvent) => void;
  /** 触摸结束处理函数 */
  handleTouchEnd: (e: TouchEvent | React.TouchEvent) => void;
}
