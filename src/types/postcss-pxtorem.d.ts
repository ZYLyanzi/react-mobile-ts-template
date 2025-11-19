/**
 * postcss-pxtorem 类型声明
 */
declare module 'postcss-pxtorem' {
  import { PluginCreator } from 'postcss'

  interface Options {
    rootValue?: number | ((input: { file: string }) => number)
    unitPrecision?: number
    propList?: string[]
    selectorBlackList?: (string | RegExp)[]
    replace?: boolean
    mediaQuery?: boolean
    minPixelValue?: number
    exclude?: string | RegExp | ((filePath: string) => boolean)
  }

  const pxtorem: PluginCreator<Options>
  export default pxtorem
}

