import { useRef } from 'react';

import type { TouchPosition, UseTouchOptions, UseTouchReturn } from './types';

/**
 * 触摸手势 Hook
 *
 * 用于处理移动端触摸手势，支持滑动方向检测
 *
 * @param options 配置选项
 * @returns 触摸处理函数和位置信息
 *
 * @example
 * ```tsx
 * function SwipeCard() {
 *   const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouch({
 *     onSwipeLeft: () => console.log('向左滑动'),
 *     onSwipeRight: () => console.log('向右滑动'),
 *     threshold: 50, // 滑动50px才触发
 *   })
 *
 *   return (
 *     <div
 *       onTouchStart={handleTouchStart}
 *       onTouchMove={handleTouchMove}
 *       onTouchEnd={handleTouchEnd}
 *     >
 *       滑动我试试
 *     </div>
 *   )
 * }
 * ```
 */
export function useTouch(options: UseTouchOptions = {}): UseTouchReturn {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = options;

  const position = useRef<TouchPosition>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    deltaX: 0,
    deltaY: 0,
  });

  /**
   * 获取触摸点坐标
   */
  const getTouchPosition = (e: TouchEvent | React.TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : (e as React.TouchEvent).touches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  /**
   * 触摸开始
   */
  const handleTouchStart = (e: TouchEvent | React.TouchEvent) => {
    const { x, y } = getTouchPosition(e);
    position.current.startX = x;
    position.current.startY = y;
    position.current.endX = x;
    position.current.endY = y;
    position.current.deltaX = 0;
    position.current.deltaY = 0;

    onTouchStart?.(position.current);
  };

  /**
   * 触摸移动
   */
  const handleTouchMove = (e: TouchEvent | React.TouchEvent) => {
    const { x, y } = getTouchPosition(e);
    position.current.endX = x;
    position.current.endY = y;
    position.current.deltaX = position.current.endX - position.current.startX;
    position.current.deltaY = position.current.endY - position.current.startY;

    onTouchMove?.(position.current);
  };

  /**
   * 触摸结束
   */
  const handleTouchEnd = () => {
    const { deltaX, deltaY } = position.current;

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // 垂直滑动
      if (deltaY > threshold && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < -threshold && onSwipeUp) {
        onSwipeUp();
      }
    }

    onTouchEnd?.(position.current);
  };

  return {
    position: position.current,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
