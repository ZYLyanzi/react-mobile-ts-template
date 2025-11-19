import { create } from 'zustand';

interface State {
  count: number;
  isLoading: boolean;
}

type Action = {
  showLoading: Fn;
  hideLoading: Fn;
  show: Fn; // 别名
  hide: Fn; // 别名
};

/**
 * 场景：
 * 并发请求，响应有快有慢，第一个请求完成后就给loading设置false结束了，实际我们要最后一个请求完成之后才结束loading，所以需要计数。
 */
export const useLoadingStore = create<State & Action>((set) => ({
  count: 0, // 用于记录并发请求的数量
  isLoading: false,
  showLoading: () => set((state) => ({ ...state, count: state.count + 1, isLoading: true })),
  hideLoading: () =>
    set((state) => ({ ...state, count: state.count - 1, isLoading: state.count - 1 > 0 })),
  // 别名方法（为了兼容不同命名习惯）
  show: function () {
    this.showLoading()
  },
  hide: function () {
    this.hideLoading()
  },
}));
