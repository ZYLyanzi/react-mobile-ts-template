/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // 移动端断点配置
    screens: {
      xs: '320px', // 小屏手机
      sm: '375px', // iPhone SE等
      md: '414px', // iPhone Plus等
      lg: '768px', // 平板
      xl: '1024px', // 桌面
    },
    extend: {
      // 主题色（与antd-mobile保持一致）
      colors: {
        primary: '#1677ff',
        success: '#00b578',
        warning: '#ff8f1f',
        danger: '#ff3141',
        text: {
          primary: '#333333',
          secondary: '#666666',
          placeholder: '#999999',
        },
        border: '#eeeeee',
        bg: '#f5f5f5',
      },
      // 安全区域
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
      // 字体大小（rem单位，会被pxtorem转换）
      fontSize: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
  // 确保与postcss-pxtorem兼容
  corePlugins: {
    preflight: true,
  },
}

