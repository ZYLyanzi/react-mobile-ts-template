import { usePopupStore } from '@/store';

import type { PopupNames } from '@/constants';

import type { UsePopupReturn } from './types';

/**
 * 弹窗管理 Hook
 *
 * 提供统一的弹窗控制方法，配合 usePopupStore 使用
 *
 * @example
 * ```typescript
 * import { usePopup } from '@/hooks'
 * import { PopupNames } from '@/constants'
 *
 * function MyComponent() {
 *   const { popShow, popClose, popCloseAll } = usePopup()
 *
 *   // 打开弹窗
 *   const handleOpen = () => {
 *     popShow(PopupNames.DEMO)
 *   }
 *
 *   // 打开弹窗并关闭其他
 *   const handleOpenExclusive = () => {
 *     popShow(PopupNames.DEMO, true)
 *   }
 *
 *   // 关闭弹窗
 *   const handleClose = () => {
 *     popClose(PopupNames.DEMO)
 *   }
 *
 *   // 关闭所有弹窗
 *   const handleCloseAll = () => {
 *     popCloseAll()
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={handleOpen}>打开弹窗</button>
 *       <button onClick={handleCloseAll}>关闭所有</button>
 *     </>
 *   )
 * }
 * ```
 */
export function usePopup(): UsePopupReturn {
  const list = usePopupStore((state) => state.list);

  /**
   * 打开弹窗
   * @param key 弹窗名称（使用 PopupNames 枚举）
   * @param closeOthers 是否关闭其他弹窗，默认 false
   */
  const popShow = (key: PopupNames, closeOthers = false) => {
    const popup = list.get(key);

    if (!popup) {
      console.warn(`[usePopup] 弹窗未注册: ${key}`);
      return;
    }

    if (popup.show) {
      console.warn(`[usePopup] 弹窗已打开: ${key}`);
      return;
    }

    // 关闭其他弹窗
    if (closeOthers) {
      popCloseAll();
    }

    popup.setShow(true);
  };

  /**
   * 关闭弹窗
   * @param key 弹窗名称
   */
  const popClose = (key: PopupNames) => {
    const popup = list.get(key);

    if (!popup) {
      console.warn(`[usePopup] 弹窗未注册: ${key}`);
      return;
    }

    if (!popup.show) {
      console.warn(`[usePopup] 弹窗已关闭: ${key}`);
      return;
    }

    popup.setShow(false);
  };

  /**
   * 关闭所有弹窗
   */
  const popCloseAll = () => {
    list.forEach((popup) => {
      if (popup.show) {
        popup.setShow(false);
      }
    });
  };

  /**
   * 获取已打开的弹窗列表
   * @returns 打开的弹窗名称数组
   */
  const getOpenPopups = (): PopupNames[] => {
    const openList: PopupNames[] = [];
    list.forEach((popup, key) => {
      if (popup.show) {
        openList.push(key);
      }
    });
    return openList;
  };

  /**
   * 检查弹窗是否打开
   * @param key 弹窗名称
   * @returns 是否打开
   */
  const isPopupOpen = (key: PopupNames): boolean => {
    const popup = list.get(key);
    return popup?.show ?? false;
  };

  return {
    popShow,
    popClose,
    popCloseAll,
    getOpenPopups,
    isPopupOpen,
  };
}
