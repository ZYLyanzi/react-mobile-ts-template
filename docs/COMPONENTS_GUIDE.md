# 🎨 组件使用指南

## 移动端组件

### SafeArea - 安全区域

适配刘海屏、圆角屏，自动添加安全区域内边距。

```tsx
import { SafeArea } from '@/components'

// 顶部安全区域（适配刘海）
<SafeArea position="top">
  <header>顶部内容</header>
</SafeArea>

// 底部安全区域（适配圆角、Home指示器）
<SafeArea position="bottom">
  <footer>底部内容</footer>
</SafeArea>

// 上下都添加
<SafeArea position="both">
  <main>主要内容</main>
</SafeArea>
```

**应用场景：**
- 固定顶部导航栏
- 固定底部导航栏
- 全面屏适配

### NavBar - 导航栏

基于 antd-mobile NavBar 封装，增加移动端优化。

```tsx
import { NavBar } from '@/components'

// 基础用法
<NavBar title="页面标题" />

// 带返回按钮
<NavBar title="详情页" showBack />

// 自定义返回事件
<NavBar
  title="设置"
  onBack={() => {
    // 自定义返回逻辑
    if (hasUnsavedChanges) {
      showConfirmDialog()
    } else {
      router.back()
    }
  }}
/>

// 自定义左右内容
<NavBar
  title="我的"
  left={<button>返回</button>}
  right={<button>设置</button>}
/>

// 固定定位 + 安全区域
<NavBar title="首页" fixed safeArea />

// 固定时记得添加占位符
<NavBar title="首页" fixed safeArea />
<div className="nav-bar-placeholder with-safe-area" />
```

**Props:**
- `title` - 标题
- `left` - 左侧内容
- `right` - 右侧内容
- `onBack` - 返回事件
- `showBack` - 是否显示返回箭头（默认 true）
- `fixed` - 是否固定定位（默认 false）
- `safeArea` - 是否添加安全区域（默认 true）

### TabBar - 底部导航

底部导航栏组件，支持路由自动切换。

```tsx
import { TabBar } from '@/components'
import { AppOutline, UserOutline } from 'antd-mobile-icons'

const tabs = [
  {
    key: '/home',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: '/user',
    title: '我的',
    icon: <UserOutline />,
    badge: '5', // 徽标
  },
]

// 基础用法（自动路由跳转）
<TabBar items={tabs} fixed safeArea />

// 自定义切换事件
<TabBar
  items={tabs}
  onChange={(key) => {
    console.log('切换到:', key)
    // 自定义跳转逻辑
  }}
/>

// 固定时记得添加占位符
<TabBar items={tabs} fixed safeArea />
<div className="tab-bar-placeholder with-safe-area" />
```

**Props:**
- `items` - 标签配置数组
- `defaultActiveKey` - 默认激活的key
- `onChange` - 切换回调
- `fixed` - 是否固定定位（默认 true）
- `safeArea` - 是否添加安全区域（默认 true）

## 样式工具

### SCSS Mixins

项目提供了丰富的 SCSS Mixins：

```scss
@use '@/styles/scss/mixins.scss' as *;

// Flex 居中
.container {
  @include flex-center;
}

// 单行文本省略
.title {
  @include ellipsis;
}

// 多行文本省略（2行）
.content {
  @include ellipsis-multi(2);
}

// 1px 边框（高清屏适配）
.card {
  @include hairline(all, #eee);
}

.divider {
  @include hairline(bottom, #ddd);
}

// 安全区域内边距
.header {
  @include safe-area-inset(top);
}

.footer {
  @include safe-area-inset(bottom);
}

// 三角形
.arrow {
  @include triangle(down, 10px, #333);
}

// 圆形
.avatar {
  @include circle(80px);
}

// 固定居中
.modal {
  @include fixed-center;
}

// 隐藏滚动条
.scroll-container {
  @include hide-scrollbar;
}

// 禁用文本选择
.no-select-text {
  @include no-select;
}
```

### 可用的 Mixins

| Mixin | 说明 | 参数 |
|-------|------|------|
| `flex-center` | Flex 居中 | - |
| `flex-center-x` | Flex 水平居中 | - |
| `flex-center-y` | Flex 垂直居中 | - |
| `flex-between` | Flex 两端对齐 | - |
| `clearfix` | 清除浮动 | - |
| `ellipsis` | 单行省略 | - |
| `ellipsis-multi($lines)` | 多行省略 | 行数 |
| `hairline($direction, $color)` | 1px边框 | 方向, 颜色 |
| `safe-area-inset($position, $property)` | 安全区域 | 位置, 属性 |
| `fixed-center` | 固定居中 | - |
| `absolute-center` | 绝对居中 | - |
| `absolute-full` | 绝对填充 | - |
| `no-select` | 禁用选择 | - |
| `hide-scrollbar` | 隐藏滚动条 | - |
| `circle($size)` | 圆形 | 大小 |
| `square($size)` | 正方形 | 大小 |
| `triangle($direction, $size, $color)` | 三角形 | 方向, 大小, 颜色 |

## 样式变量

### 使用 SCSS 变量

```scss
@use '@/styles/scss/var.scss' as *;

.my-button {
  background: $primary-color;
  font-size: $font-size-lg;
  padding: $spacing-md;
  border-radius: $radius-md;
}
```

### 使用 CSS 变量

```tsx
<div
  style={{
    color: 'var(--adm-color-primary)',
    fontSize: 'var(--adm-font-size-6)',
  }}
>
  使用 antd-mobile 的 CSS 变量
</div>
```

## 实战案例

### 案例 1: 标准页面布局

```tsx
import { NavBar, TabBar, SafeArea } from '@/components'

function StandardPage() {
  const tabs = [
    { key: '/home', title: '首页', icon: <AppOutline /> },
    { key: '/user', title: '我的', icon: <UserOutline /> },
  ]

  return (
    <div className="standard-page">
      {/* 顶部导航 */}
      <NavBar title="首页" fixed safeArea />
      <div className="nav-bar-placeholder with-safe-area" />

      {/* 主要内容 */}
      <main className="page-content">
        {/* 内容 */}
      </main>

      {/* 底部导航 */}
      <TabBar items={tabs} fixed safeArea />
      <div className="tab-bar-placeholder with-safe-area" />
    </div>
  )
}
```

### 案例 2: 使用 1px 边框

```scss
.card {
  padding: 32px;
  background: #fff;
  
  // 四周 1px 边框
  @include hairline(all, #eee);
}

.list-item {
  padding: 24px 32px;
  
  // 底部 1px 分割线
  @include hairline(bottom, #f0f0f0);
  
  &:last-child::after {
    display: none; // 最后一项不显示
  }
}
```

### 案例 3: 响应式文本

```scss
.title {
  font-size: 32px;
  
  // 单行省略
  @include ellipsis;
}

.description {
  font-size: 28px;
  color: #666;
  
  // 最多显示2行
  @include ellipsis-multi(2);
}
```

## 最佳实践

### ✅ 推荐做法

```scss
// 1. 使用 Mixins 提高复用性
.card {
  @include flex-between;
  @include hairline(bottom);
}

// 2. 使用变量保持一致性
.button {
  background: $primary-color;
  font-size: $font-size-lg;
}

// 3. 移动端优化
.touch-area {
  @include no-select; // 禁用文本选择
  -webkit-tap-highlight-color: transparent; // 移除点击高亮
}

// 4. 安全区域适配
.fixed-header {
  position: fixed;
  top: 0;
  @include safe-area-inset(top, padding);
}
```

### ❌ 不推荐做法

```scss
// ❌ 重复写相同样式
.container1 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

// ✅ 使用 Mixin
.container1,
.container2 {
  @include flex-center;
}

// ❌ 硬编码颜色
.button {
  background: #1677ff; // 不要硬编码
}

// ✅ 使用变量
.button {
  background: $primary-color;
}
```

## 主题定制

### 定制 antd-mobile 主题

修改 `src/styles/scss/antd-mobile-custom.scss`：

```scss
:root:root {
  --adm-color-primary: #1677ff; // 主题色
  --adm-color-success: #00b578; // 成功色
  --adm-font-size-main: 28px;   // 主字号
}
```

### 定制组件样式

```scss
// 覆盖 Button 样式
.adm-button {
  border-radius: 12px; // 更圆润的圆角
  
  &-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
```

## 总结

组件和样式提供：
- ✅ 3个移动端组件（SafeArea、NavBar、TabBar）
- ✅ 丰富的 SCSS Mixins（17个）
- ✅ 移动端优化的 Reset 样式
- ✅ antd-mobile 主题定制
- ✅ 完整的使用文档

**记住：使用这些组件和样式工具，快速构建美观的移动端应用！** 🎉

