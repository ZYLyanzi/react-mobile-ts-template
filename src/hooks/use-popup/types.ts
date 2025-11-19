import type { PopupNames } from '@/constants';

/**
 * usePopup Hook 返回类型
 */
export interface UsePopupReturn {
  /** 打开弹窗 */
  popShow: (key: PopupNames, closeOthers?: boolean) => void;
  /** 关闭弹窗 */
  popClose: (key: PopupNames) => void;
  /** 关闭所有弹窗 */
  popCloseAll: () => void;
  /** 获取已打开的弹窗列表 */
  getOpenPopups: () => PopupNames[];
  /** 检查弹窗是否打开 */
  isPopupOpen: (key: PopupNames) => boolean;
}
