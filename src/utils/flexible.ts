/**
 * 移动端flexible适配方案
 * 设计稿宽度：750px
 * 基准值：75 (750/10)
 * 
 * 原理：
 * 1. 动态计算根元素font-size
 * 2. 配合postcss-pxtorem将px转为rem
 * 3. 实现移动端自适应
 */

const flexible = () => {
  const doc = document
  const win = window
  const docEl = doc.documentElement
  const dpr = win.devicePixelRatio || 1

  // 设置body字体大小
  const setBodyFontSize = () => {
    if (doc.body) {
      doc.body.style.fontSize = 12 * dpr + 'px'
    } else {
      doc.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // 设置rem基准值
  const setRemUnit = () => {
    const width = docEl.clientWidth
    // 限制最大和最小宽度，防止极端情况
    // 最小 320px / 10 = 32
    // 最大 750px / 10 = 75
    const rem = Math.min(Math.max(width / 10, 32), 75)
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 窗口大小改变时重新计算
  win.addEventListener('resize', setRemUnit)
  win.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 检测0.5px支持（用于1px边框）
  if (dpr >= 2) {
    const fakeBody = doc.createElement('body')
    const testElement = doc.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}

// 立即执行
flexible()

export default flexible

