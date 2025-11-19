import { useState } from 'react';

import { Button, List, Toast } from 'antd-mobile';

import { ConfirmPopup, DemoPopup } from '@/components/popups';

import { usePopup } from '@/hooks';

import { PopupNames } from '@/constants';

import './index.scss';

/**
 * 弹窗管理演示页面
 *
 * 展示弹窗管理系统的各种用法
 */
export default function PopupDemoPage() {
  const { popShow, popClose, popCloseAll, getOpenPopups, isPopupOpen } = usePopup();
  const [confirmConfig, setConfirmConfig] = useState({});

  // 打开示例弹窗
  const handleOpenDemo = () => {
    popShow(PopupNames.DEMO);
  };

  // 打开示例弹窗（并关闭其他）
  const handleOpenDemoExclusive = () => {
    popShow(PopupNames.DEMO, true);
  };

  // 关闭示例弹窗
  const handleCloseDemo = () => {
    popClose(PopupNames.DEMO);
  };

  // 打开确认弹窗
  const handleOpenConfirm = () => {
    setConfirmConfig({
      title: '操作确认',
      content: '确定要执行此操作吗？',
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: async () => {
        // 模拟异步操作
        await new Promise((resolve) => setTimeout(resolve, 1000));
        Toast.show({ icon: 'success', content: '操作成功' });
      },
      onCancel: () => {
        Toast.show('已取消');
      },
    });
    popShow(PopupNames.CONFIRM);
  };

  // 关闭所有弹窗
  const handleCloseAll = () => {
    popCloseAll();
    Toast.show('已关闭所有弹窗');
  };

  // 查看打开的弹窗
  const handleCheckOpen = () => {
    const openList = getOpenPopups();
    if (openList.length === 0) {
      Toast.show('当前没有打开的弹窗');
    } else {
      Toast.show(`打开的弹窗: ${openList.join(', ')}`);
    }
  };

  // 检查弹窗状态
  const handleCheckStatus = () => {
    const isDemoOpen = isPopupOpen(PopupNames.DEMO);
    Toast.show(`DEMO弹窗${isDemoOpen ? '已打开' : '已关闭'}`);
  };

  return (
    <div className="popup-demo-page">
      <div className="page-header">
        <h1>弹窗管理演示</h1>
        <p className="page-desc">展示集中式弹窗管理的各种用法</p>
      </div>

      <List header="基础操作">
        <List.Item
          extra={
            <Button color="primary" size="small" onClick={handleOpenDemo}>
              打开
            </Button>
          }
        >
          打开 DEMO 弹窗
        </List.Item>
        <List.Item
          extra={
            <Button color="primary" size="small" onClick={handleOpenDemoExclusive}>
              打开
            </Button>
          }
        >
          打开 DEMO（互斥模式）
        </List.Item>
        <List.Item
          extra={
            <Button size="small" onClick={handleCloseDemo}>
              关闭
            </Button>
          }
        >
          关闭 DEMO 弹窗
        </List.Item>
      </List>

      <List header="确认弹窗">
        <List.Item
          extra={
            <Button color="primary" size="small" onClick={handleOpenConfirm}>
              打开
            </Button>
          }
        >
          打开确认弹窗
        </List.Item>
        <List.Item description="支持异步操作，按钮loading状态">确认弹窗特性</List.Item>
      </List>

      <List header="批量操作">
        <List.Item
          extra={
            <Button color="danger" size="small" onClick={handleCloseAll}>
              关闭
            </Button>
          }
        >
          关闭所有弹窗
        </List.Item>
      </List>

      <List header="状态查询">
        <List.Item
          extra={
            <Button size="small" onClick={handleCheckOpen}>
              查看
            </Button>
          }
        >
          查看已打开的弹窗
        </List.Item>
        <List.Item
          extra={
            <Button size="small" onClick={handleCheckStatus}>
              检查
            </Button>
          }
        >
          检查 DEMO 弹窗状态
        </List.Item>
      </List>

      <div className="tips-section">
        <h3>使用说明</h3>
        <ul>
          <li>弹窗状态集中管理，可在任何地方控制</li>
          <li>支持互斥模式（打开一个关闭其他）</li>
          <li>支持批量关闭所有弹窗</li>
          <li>完整的状态查询功能</li>
          <li>类型安全，避免拼写错误</li>
        </ul>
      </div>

      {/* 弹窗组件 */}
      <DemoPopup />
      <ConfirmPopup {...confirmConfig} />
    </div>
  );
}
