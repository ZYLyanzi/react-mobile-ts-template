import { useEffect, useState } from 'react';

import { Button, Popup, Space } from 'antd-mobile';

import { usePopupStore } from '@/store';

import { PopupNames } from '@/constants';

/**
 * 示例弹窗组件
 *
 * 展示如何创建和使用弹窗：
 * 1. 在组件中注册弹窗到 PopupStore
 * 2. 组件卸载时移除弹窗
 * 3. 配合 usePopup Hook 在任何地方控制
 *
 * @example
 * ```tsx
 * // 在页面中引入弹窗组件
 * <DemoPopup />
 *
 * // 在任何地方控制弹窗
 * import { usePopup } from '@/hooks'
 * const { popShow } = usePopup()
 * popShow(PopupNames.DEMO)
 * ```
 */
export function DemoPopup() {
  const [visible, setVisible] = useState(false);
  const { setPopup, removePopup } = usePopupStore();

  // 注册弹窗
  useEffect(() => {
    setPopup(PopupNames.DEMO, {
      show: visible,
      setShow: setVisible,
    });

    // 组件卸载时移除弹窗
    return () => {
      removePopup(PopupNames.DEMO);
    };
  }, [visible, setPopup, removePopup]);

  return (
    <Popup
      visible={visible}
      onMaskClick={() => setVisible(false)}
      bodyStyle={{
        minHeight: '40vh',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '20px',
      }}
    >
      <div className="demo-popup">
        <h2 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>示例弹窗</h2>
        <p style={{ fontSize: '28px', color: '#666', marginBottom: '40px' }}>
          这是一个示例弹窗，展示如何使用弹窗管理系统。
        </p>
        <p style={{ fontSize: '24px', color: '#999', marginBottom: '20px' }}>特性：</p>
        <ul style={{ fontSize: '24px', color: '#666', paddingLeft: '40px' }}>
          <li>集中管理弹窗状态</li>
          <li>在任何地方控制弹窗</li>
          <li>支持关闭所有弹窗</li>
          <li>类型安全</li>
        </ul>
        <Space block direction="vertical" style={{ marginTop: '40px' }}>
          <Button block color="primary" onClick={() => setVisible(false)}>
            关闭弹窗
          </Button>
        </Space>
      </div>
    </Popup>
  );
}

export default DemoPopup;
