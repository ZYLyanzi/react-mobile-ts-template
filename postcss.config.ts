import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ['Android >= 4.0', 'iOS >= 8'],
    }),
    pxtorem({
      rootValue: 75, // 设计稿宽度 750px / 10
      unitPrecision: 5, // rem小数点位数
      propList: ['*'], // 所有属性都转换
      selectorBlackList: ['norem', 'ant-'], // 黑名单：不转换以norem开头和ant-开头的类
      replace: true,
      mediaQuery: false,
      minPixelValue: 1, // 最小转换值1px
      exclude: /node_modules\/(?!antd-mobile)/, // 排除node_modules，但包含antd-mobile
    }),
  ],
}

