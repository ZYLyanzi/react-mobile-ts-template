import { useEffect, useState } from 'react';

/**
 * 安全区域信息
 */
export interface SafeArea {
  /** 顶部安全区域 */
  top: number;
  /** 右侧安全区域 */
  right: number;
  /** 底部安全区域 */
  bottom: number;
  /** 左侧安全区域 */
  left: number;
}

/**
 * 安全区域 Hook
 *
 * 获取设备的安全区域（主要用于适配刘海屏、圆角等）
 *
 * @returns 安全区域信息
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const safeArea = useSafeArea()
 *
 *   return (
 *     <div
 *       style={{
 *         paddingTop: safeArea.top,
 *         paddingBottom: safeArea.bottom,
 *       }}
 *     >
 *       内容会避开安全区域
 *     </div>
 *   )
 * }
 *
 * // 使用 CSS 变量
 * function Header() {
 *   useSafeArea() // 会设置 CSS 变量
 *
 *   return (
 *     <header style={{ paddingTop: 'var(--safe-area-top)' }}>
 *       标题栏
 *     </header>
 *   )
 * }
 * ```
 */
export function useSafeArea(): SafeArea {
  const [safeArea, setSafeArea] = useState<SafeArea>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      const top =
        parseInt(
          computedStyle.getPropertyValue('--sat') ||
            computedStyle.getPropertyValue('env(safe-area-inset-top)') ||
            '0',
        ) || 0;

      const right =
        parseInt(
          computedStyle.getPropertyValue('--sar') ||
            computedStyle.getPropertyValue('env(safe-area-inset-right)') ||
            '0',
        ) || 0;

      const bottom =
        parseInt(
          computedStyle.getPropertyValue('--sab') ||
            computedStyle.getPropertyValue('env(safe-area-inset-bottom)') ||
            '0',
        ) || 0;

      const left =
        parseInt(
          computedStyle.getPropertyValue('--sal') ||
            computedStyle.getPropertyValue('env(safe-area-inset-left)') ||
            '0',
        ) || 0;

      const newSafeArea = { top, right, bottom, left };
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setSafeArea(newSafeArea);

      // 设置 CSS 变量，方便在样式中使用
      document.documentElement.style.setProperty('--safe-area-top', `${top}px`);
      document.documentElement.style.setProperty('--safe-area-right', `${right}px`);
      document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`);
      document.documentElement.style.setProperty('--safe-area-left', `${left}px`);
    };

    updateSafeArea();

    // 监听窗口变化（横竖屏切换）
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
}
