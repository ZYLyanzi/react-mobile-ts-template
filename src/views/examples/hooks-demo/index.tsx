import { useState } from 'react';

import { Card, List, Tag } from 'antd-mobile';

import { useNetwork, useSafeArea, useScroll, useTouch, useViewport } from '@/hooks';

import './index.scss';

/**
 * Hooks 演示页面
 *
 * 展示所有移动端专用 Hooks 的功能
 */
export default function HooksDemoPage() {
  const [swipeDirection, setSwipeDirection] = useState('');
  const scrollInfo = useScroll();
  const viewport = useViewport();
  const safeArea = useSafeArea();
  const network = useNetwork();

  // useTouch 演示
  const { handleTouchStart, handleTouchMove, handleTouchEnd, position } = useTouch({
    onSwipeLeft: () => setSwipeDirection('向左滑动 ←'),
    onSwipeRight: () => setSwipeDirection('向右滑动 →'),
    onSwipeUp: () => setSwipeDirection('向上滑动 ↑'),
    onSwipeDown: () => setSwipeDirection('向下滑动 ↓'),
    threshold: 50,
  });

  return (
    <div className="hooks-demo-page">
      <div className="page-header">
        <h1>Hooks 演示</h1>
        <p className="page-desc">移动端专用 Hooks 功能展示</p>
      </div>

      {/* useTouch 演示 */}
      <Card title="useTouch - 触摸手势" className="demo-card">
        <div
          className="touch-area"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <p className="touch-tip">在这里滑动试试</p>
          {swipeDirection && <Tag color="primary">{swipeDirection}</Tag>}
          <div className="touch-info">
            <p>
              起始: ({Math.round(position.startX)}, {Math.round(position.startY)})
            </p>
            <p>
              结束: ({Math.round(position.endX)}, {Math.round(position.endY)})
            </p>
            <p>
              移动: ({Math.round(position.deltaX)}, {Math.round(position.deltaY)})
            </p>
          </div>
        </div>
      </Card>

      {/* useScroll 演示 */}
      <Card title="useScroll - 滚动监听" className="demo-card">
        <List>
          <List.Item extra={`${Math.round(scrollInfo.scrollY)}px`}>滚动位置</List.Item>
          <List.Item extra={scrollInfo.direction || '无'}>滚动方向</List.Item>
          <List.Item extra={scrollInfo.isScrolling ? '是' : '否'}>正在滚动</List.Item>
        </List>
        <p className="tip">向下滚动页面查看滚动信息变化</p>
      </Card>

      {/* useViewport 演示 */}
      <Card title="useViewport - 视口信息" className="demo-card">
        <List>
          <List.Item extra={`${viewport.width}px`}>视口宽度</List.Item>
          <List.Item extra={`${viewport.height}px`}>视口高度</List.Item>
          <List.Item
            extra={
              <Tag color={viewport.orientation === 'portrait' ? 'primary' : 'warning'}>
                {viewport.orientation === 'portrait' ? '竖屏' : '横屏'}
              </Tag>
            }
          >
            屏幕方向
          </List.Item>
          <List.Item extra={viewport.dpr}>设备像素比</List.Item>
        </List>
        <p className="tip">旋转屏幕查看方向变化</p>
      </Card>

      {/* useSafeArea 演示 */}
      <Card title="useSafeArea - 安全区域" className="demo-card">
        <List>
          <List.Item extra={`${safeArea.top}px`}>顶部安全区域</List.Item>
          <List.Item extra={`${safeArea.right}px`}>右侧安全区域</List.Item>
          <List.Item extra={`${safeArea.bottom}px`}>底部安全区域</List.Item>
          <List.Item extra={`${safeArea.left}px`}>左侧安全区域</List.Item>
        </List>
        <p className="tip">在刘海屏或圆角屏设备上查看</p>
      </Card>

      {/* useNetwork 演示 */}
      <Card title="useNetwork - 网络状态" className="demo-card">
        <List>
          <List.Item
            extra={
              <Tag color={network.online ? 'success' : 'danger'}>
                {network.online ? '在线' : '离线'}
              </Tag>
            }
          >
            网络状态
          </List.Item>
          <List.Item extra={network.effectiveType || '未知'}>网络类型</List.Item>
          <List.Item extra={network.downlink ? `${network.downlink} Mbps` : '未知'}>
            下行速度
          </List.Item>
          <List.Item extra={network.rtt ? `${network.rtt} ms` : '未知'}>往返时间</List.Item>
          <List.Item extra={network.saveData ? '是' : '否'}>省流模式</List.Item>
        </List>
        <p className="tip">切换网络或开启飞行模式查看变化</p>
      </Card>

      {/* 填充内容，用于测试滚动 */}
      <div className="scroll-placeholder">
        <p>向下滚动测试 useScroll</p>
        {Array.from({ length: 10 }, (_, i) => `placeholder-${i}`).map((id, i) => (
          <div key={id} className="placeholder-item">
            占位内容 {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
