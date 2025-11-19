# 📱 移动端适配使用指南

## 快速上手

### 基本使用

假设你拿到一份 **750px** 的设计稿，其中一个元素的尺寸是 **100px × 100px**。

**直接按设计稿写 px 值即可！**

```tsx
// ✅ 正确写法：直接写设计稿的 px 值
<div style={{ width: '100px', height: '100px' }}>
  我会自动适配不同屏幕
</div>
```

构建后会自动转换为：

```css
/* 编译后的代码 */
div {
  width: 1.33333rem;  /* 100px ÷ 75 = 1.33333rem */
  height: 1.33333rem;
}
```

## 完整示例

### 1. React 组件中使用

```tsx
import { FC } from 'react'

const ProductCard: FC = () => {
  return (
    <div
      style={{
        width: '345px',      // 设计稿宽度
        padding: '20px',     // 设计稿内边距
        marginBottom: '16px', // 设计稿外边距
        borderRadius: '12px', // 设计稿圆角
      }}
    >
      <img
        src="/product.jpg"
        style={{
          width: '305px',    // 图片宽度
          height: '305px',   // 图片高度
        }}
        alt="商品"
      />
      <h3 style={{ fontSize: '28px' }}>商品标题</h3>
      <p style={{ fontSize: '24px', color: '#666' }}>¥199.00</p>
    </div>
  )
}

export default ProductCard
```

**显示效果：**
- 在 375px 屏幕上：元素宽度 = 345px ÷ 2 = 172.5px
- 在 414px 屏幕上：元素宽度 = 345px ÷ 750 × 414 = 190.62px

### 2. SCSS 文件中使用

```scss
// styles/components/product-card.scss
.product-card {
  width: 345px;           // 直接写 px
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 12px;
  background: #fff;

  &__image {
    width: 305px;
    height: 305px;
    object-fit: cover;
  }

  &__title {
    font-size: 28px;      // 字体大小也会转换
    font-weight: bold;
    margin: 16px 0 8px;
  }

  &__price {
    font-size: 24px;
    color: #ff3141;
  }
}
```

### 3. Tailwind CSS 中使用

```tsx
<div className="w-[345px] p-[20px] mb-[16px] rounded-[12px]">
  <img
    src="/product.jpg"
    className="w-[305px] h-[305px] object-cover"
    alt="商品"
  />
  <h3 className="text-[28px] font-bold my-[16px]">商品标题</h3>
  <p className="text-[24px] text-danger">¥199.00</p>
</div>
```

## 特殊情况处理

### 1. 不需要转换的元素（使用 norem 前缀）

某些元素你希望使用固定的 px 值，不随屏幕缩放：

```scss
// ❌ 会被转换
.button {
  border: 1px solid #ccc;  // 会转成 0.0133rem，可能显示不出来
}

// ✅ 不会被转换（使用 norem 前缀）
.button-norem {
  border: 1px solid #ccc;  // 保持 1px，不转换
}
```

```tsx
// React 中使用
<button className="norem-border">
  我的边框是固定 1px
</button>
```

### 2. antd-mobile 组件

**无需特殊处理！** 我们的配置已自动处理：

```tsx
import { Button, List, Dialog } from 'antd-mobile'

// ✅ 直接使用，组件内部样式不会被转换
<Button color="primary">确定</Button>
<List>
  <List.Item>列表项</List.Item>
</List>
```

配置中的 `selectorBlackList: ['ant-']` 确保了所有 `ant-` 开头的类名不会被转换。

### 3. 行内样式中使用其他单位

```tsx
// 如果你想使用 rem、em、vh 等单位，直接写即可
<div style={{
  width: '100px',      // 会转换为 rem
  height: '50vh',      // 不会转换，保持 vh
  fontSize: '1.2em',   // 不会转换，保持 em
  padding: '0.5rem',   // 不会转换，保持 rem
}}>
  混合使用不同单位
</div>
```

## 实际开发流程

### 步骤 1：获取设计稿

- 确认设计稿宽度（通常是 750px）
- 使用设计工具（Figma/Sketch）标注尺寸

### 步骤 2：直接写代码

```tsx
// 设计稿标注：容器宽度 345px，高度 200px
<div style={{ width: '345px', height: '200px' }}>
  {/* 内容 */}
</div>
```

### 步骤 3：测试不同屏幕

```bash
# 启动开发服务器
pnpm dev
```

在 Chrome DevTools 中测试：
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPhone 14 Plus (428px)
- iPad Mini (768px)

### 步骤 4：查看效果

打开浏览器控制台，查看实际转换：

```javascript
// 查看根元素 font-size
console.log(getComputedStyle(document.documentElement).fontSize)
// 375px 屏幕：37.5px
// 414px 屏幕：41.4px

// 查看元素实际宽度
const el = document.querySelector('.my-element')
console.log(getComputedStyle(el).width)
```

## 常见问题

### Q1: 为什么有些元素没有缩放？

**A:** 检查是否使用了黑名单类名：
- `norem-` 开头的类不会转换
- `ant-` 开头的类不会转换（antd-mobile）

### Q2: 1px 边框太粗或看不见？

**A:** 使用 `norem` 前缀：

```scss
// ❌ 问题：会被转换成很小的值
.card {
  border: 1px solid #ccc;
}

// ✅ 解决：使用 norem
.card-norem {
  border: 1px solid #ccc;
}
```

### Q3: 字体太小或太大？

**A:** 确认设计稿字体大小，直接写即可：

```scss
h1 { font-size: 32px; }  // 设计稿是 32px，直接写
h2 { font-size: 28px; }  // 设计稿是 28px，直接写
p  { font-size: 24px; }  // 设计稿是 24px，直接写
```

### Q4: 如何处理横屏？

**A:** flexible.ts 会自动处理，但建议限制最大宽度：

```scss
.container {
  max-width: 750px;  // 设计稿最大宽度
  margin: 0 auto;    // 居中显示
}
```

## 调试技巧

### 1. 查看转换结果

```bash
# 构建项目
pnpm build:dev

# 查看生成的 CSS 文件
# dist-dev/assets/css/
```

### 2. 临时禁用转换

在元素上添加 `norem` 前缀：

```tsx
<div className="norem-test" style={{ width: '100px' }}>
  这个 100px 不会被转换
</div>
```

### 3. 使用浏览器调试

```javascript
// 控制台执行
document.documentElement.style.fontSize = '100px'  // 临时改变基准值
```

## 最佳实践

### ✅ 推荐做法

```tsx
// 1. 直接写设计稿 px 值
<div style={{ width: '345px', padding: '20px' }} />

// 2. 使用 SCSS 变量
$card-width: 345px;
$card-padding: 20px;

.card {
  width: $card-width;
  padding: $card-padding;
}

// 3. 大部分元素都让它自适应
.container {
  width: 100%;       // 使用百分比
  padding: 20px;     // 内边距用 px（会转 rem）
  max-width: 750px;  // 限制最大宽度
}
```

### ❌ 不推荐做法

```tsx
// ❌ 不要自己计算 rem
<div style={{ width: '1.33333rem' }} />  // 不要这样写！

// ❌ 不要混淆设计稿尺寸
<div style={{ width: '50px' }} />  // 如果设计稿是 100px，不要写 50px

// ❌ 不要在不需要的地方使用固定值
.sidebar {
  width: 200px;  // 在移动端，侧边栏也应该自适应
}
```

## 配置说明

当前配置（已为你配置好）：

```typescript
// postcss.config.ts
{
  rootValue: 75,              // 750px ÷ 10 = 75
  unitPrecision: 5,           // rem 保留 5 位小数
  propList: ['*'],            // 所有属性都转换
  selectorBlackList: ['norem', 'ant-'],  // 黑名单
  minPixelValue: 1,           // 最小转换值 1px
}

// flexible.ts
const rem = Math.min(Math.max(width / 10, 32), 75)
// 最小 32px (320px ÷ 10)
// 最大 75px (750px ÷ 10)
```

## 总结

1. **直接写设计稿 px 值** - 最简单直接
2. **构建时自动转换** - 无需手动计算
3. **不同屏幕自适应** - flexible 动态调整
4. **特殊情况用黑名单** - norem 前缀不转换

**记住：拿到 750px 设计稿的 100px 元素，就写 `width: 100px`，就这么简单！** 🎉

