import { useEffect, useState } from 'react';

import type { ViewportInfo } from './types';

/**
 * 视口信息 Hook
 *
 * 获取并监听视口尺寸和方向变化
 *
 * @returns 视口信息
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { width, height, orientation } = useViewport()
 *
 *   return (
 *     <div>
 *       <p>视口宽度: {width}px</p>
 *       <p>视口高度: {height}px</p>
 *       <p>屏幕方向: {orientation}</p>
 *     </div>
 *   )
 * }
 *
 * // 根据屏幕方向做适配
 * function ResponsiveComponent() {
 *   const { orientation } = useViewport()
 *
 *   if (orientation === 'landscape') {
 *     return <LandscapeView />
 *   }
 *   return <PortraitView />
 * }
 * ```
 */
export function useViewport(): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    dpr: window.devicePixelRatio || 1,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        dpr: window.devicePixelRatio || 1,
      });
    };

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
}
