/**
 * 视口信息
 */
export interface ViewportInfo {
  /** 视口宽度 */
  width: number;
  /** 视口高度 */
  height: number;
  /** 屏幕方向 */
  orientation: 'portrait' | 'landscape';
  /** 设备像素比 */
  dpr: number;
}
