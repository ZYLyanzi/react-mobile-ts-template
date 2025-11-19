import { useEffect, useRef, useState } from 'react';

import { useThrottleFn } from 'ahooks';

import type { ScrollInfo, UseScrollOptions } from './types';

/**
 * 滚动监听 Hook
 *
 * 用于监听滚动事件，支持到顶/到底检测
 *
 * @param options 配置选项
 * @returns 滚动信息
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const scrollInfo = useScroll({
 *     onReachBottom: () => {
 *       console.log('到底了，加载更多')
 *     },
 *     bottomOffset: 100, // 距离底部100px时触发
 *   })
 *
 *   return <div>{scrollInfo.scrollY}</div>
 * }
 *
 * // 监听指定元素
 * const listRef = useRef<HTMLDivElement>(null)
 * const scrollInfo = useScroll({
 *   target: listRef.current,
 *   onScroll: (info) => console.log(info),
 * })
 * ```
 */
export function useScroll(options: UseScrollOptions = {}): ScrollInfo {
  const {
    target,
    onScroll,
    onReachTop,
    onReachBottom,
    bottomOffset = 100,
    throttle = 100,
  } = options;

  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollX: 0,
    scrollY: 0,
    isScrolling: false,
    direction: null,
  });

  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * 处理滚动事件
   */
  const handleScroll = () => {
    const scrollTarget = target || window;
    const scrollX = scrollTarget instanceof Window ? scrollTarget.scrollX : scrollTarget.scrollLeft;
    const scrollY = scrollTarget instanceof Window ? scrollTarget.scrollY : scrollTarget.scrollTop;

    // 判断滚动方向
    let direction: ScrollInfo['direction'] = null;
    if (scrollY > lastScrollY.current) {
      direction = 'down';
    } else if (scrollY < lastScrollY.current) {
      direction = 'up';
    }

    const info: ScrollInfo = {
      scrollX,
      scrollY,
      isScrolling: true,
      direction,
    };

    setScrollInfo(info);
    lastScrollY.current = scrollY;

    // 触发回调
    onScroll?.(info);

    // 检测到顶
    if (scrollY === 0 && onReachTop) {
      onReachTop();
    }

    // 检测到底
    if (scrollTarget instanceof Window) {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollY + clientHeight >= scrollHeight - bottomOffset && onReachBottom) {
        onReachBottom();
      }
    } else {
      const scrollHeight = scrollTarget.scrollHeight;
      const clientHeight = scrollTarget.clientHeight;
      if (scrollY + clientHeight >= scrollHeight - bottomOffset && onReachBottom) {
        onReachBottom();
      }
    }

    // 滚动结束检测
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = setTimeout(() => {
      setScrollInfo((prev) => ({ ...prev, isScrolling: false }));
    }, 150);
  };

  // 使用节流优化性能
  const { run: throttledHandleScroll } = useThrottleFn(handleScroll, {
    wait: throttle,
  });

  useEffect(() => {
    const scrollTarget = target || window;

    // 添加滚动事件监听
    const handleScrollEvent = throttledHandleScroll as any;
    scrollTarget.addEventListener('scroll', handleScrollEvent);

    // 清理函数：移除事件监听和定时器
    return () => {
      scrollTarget.removeEventListener('scroll', handleScrollEvent);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [target, throttledHandleScroll]);

  return scrollInfo;
}
