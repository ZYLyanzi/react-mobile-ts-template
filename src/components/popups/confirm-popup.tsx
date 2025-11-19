import { useEffect, useState } from 'react';

import { Button, Popup, Space } from 'antd-mobile';

import { usePopupStore } from '@/store';

import { PopupNames } from '@/constants';

/**
 * 确认弹窗组件属性
 */
interface ConfirmPopupProps {
  /** 标题 */
  title?: string;
  /** 内容 */
  content?: string;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onConfirm?: () => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
}

/**
 * 确认弹窗组件
 *
 * 提供标准的确认/取消交互
 *
 * @example
 * ```tsx
 * // 在页面中引入
 * const [confirmConfig, setConfirmConfig] = useState({})
 * <ConfirmPopup {...confirmConfig} />
 *
 * // 打开确认弹窗
 * const handleDelete = () => {
 *   setConfirmConfig({
 *     title: '删除确认',
 *     content: '确定要删除这条数据吗？',
 *     onConfirm: async () => {
 *       await deleteData()
 *       Toast.show('删除成功')
 *     }
 *   })
 *   popShow(PopupNames.CONFIRM)
 * }
 * ```
 */
export function ConfirmPopup(props: ConfirmPopupProps) {
  const {
    title = '确认',
    content = '确定要执行此操作吗？',
    confirmText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel,
  } = props;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setPopup, removePopup } = usePopupStore();

  // 注册弹窗
  useEffect(() => {
    setPopup(PopupNames.CONFIRM, {
      show: visible,
      setShow: setVisible,
    });

    return () => {
      removePopup(PopupNames.CONFIRM);
    };
  }, [visible, setPopup, removePopup]);

  // 处理确认
  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        setLoading(true);
        await onConfirm();
        setVisible(false);
      } catch (error) {
        console.error('确认操作失败:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setVisible(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    onCancel?.();
    setVisible(false);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={handleCancel}
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '32px 20px 20px',
      }}
    >
      <div className="confirm-popup">
        <h3 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>{title}</h3>
        <p
          style={{
            fontSize: '28px',
            color: '#666',
            marginBottom: '40px',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {content}
        </p>
        <Space block direction="vertical" style={{ '--gap': '12px' }}>
          <Button block color="primary" size="large" loading={loading} onClick={handleConfirm}>
            {confirmText}
          </Button>
          <Button block size="large" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
        </Space>
      </div>
    </Popup>
  );
}

export default ConfirmPopup;
