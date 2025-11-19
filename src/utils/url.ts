/**
 * URL 工具函数
 * URL参数解析、构建等
 */

/**
 * 解析 URL 参数为对象
 * @param url URL字符串（默认为当前URL）
 * @returns 参数对象
 *
 * @example
 * ```ts
 * // URL: https://example.com?name=张三&age=18
 * const params = parseUrlParams()
 * // { name: '张三', age: '18' }
 * ```
 */
export function parseUrlParams(url?: string): Record<string, string> {
  const searchParams = new URLSearchParams(url || window.location.search);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * 获取单个 URL 参数
 * @param key 参数名
 * @param url URL字符串（默认为当前URL）
 * @returns 参数值
 *
 * @example
 * ```ts
 * // URL: https://example.com?id=123
 * const id = getUrlParam('id') // '123'
 * ```
 */
export function getUrlParam(key: string, url?: string): string | null {
  const searchParams = new URLSearchParams(url || window.location.search);
  return searchParams.get(key);
}

/**
 * 构建 URL 参数字符串
 * @param params 参数对象
 * @returns 参数字符串
 *
 * @example
 * ```ts
 * buildUrlParams({ name: '张三', age: 18 })
 * // 'name=张三&age=18'
 * ```
 */
export function buildUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * 添加参数到 URL
 * @param url 基础URL
 * @param params 要添加的参数
 * @returns 完整URL
 *
 * @example
 * ```ts
 * addUrlParams('/api/user', { id: 123, type: 'detail' })
 * // '/api/user?id=123&type=detail'
 * ```
 */
export function addUrlParams(url: string, params: Record<string, any>): string {
  const paramStr = buildUrlParams(params);
  if (!paramStr) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${paramStr}`;
}

/**
 * 移除 URL 中的指定参数
 * @param url URL字符串
 * @param keys 要移除的参数名数组
 * @returns 新的URL
 *
 * @example
 * ```ts
 * removeUrlParams('https://example.com?name=张三&age=18', ['age'])
 * // 'https://example.com?name=张三'
 * ```
 */
export function removeUrlParams(url: string, keys: string[]): string {
  const urlObj = new URL(url, window.location.origin);
  const searchParams = new URLSearchParams(urlObj.search);

  keys.forEach((key) => {
    searchParams.delete(key);
  });

  const paramStr = searchParams.toString();
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  return paramStr ? `${baseUrl}?${paramStr}` : baseUrl;
}

/**
 * 更新 URL 参数（不刷新页面）
 * @param params 要更新的参数
 * @param replace 是否替换历史记录（默认 false）
 *
 * @example
 * ```ts
 * updateUrlParams({ page: 2, sort: 'time' })
 * // URL变为: ?page=2&sort=time
 * ```
 */
export function updateUrlParams(params: Record<string, any>, replace = false): void {
  const currentParams = parseUrlParams();
  const newParams = { ...currentParams, ...params };

  // 移除值为 null 或 undefined 的参数
  Object.keys(newParams).forEach((key) => {
    if (newParams[key] === null || newParams[key] === undefined) {
      delete newParams[key];
    }
  });

  const paramStr = buildUrlParams(newParams);
  const newUrl = paramStr ? `${window.location.pathname}?${paramStr}` : window.location.pathname;

  if (replace) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.history.pushState(null, '', newUrl);
  }
}

/**
 * 判断是否为外部链接
 */
export function isExternalLink(url: string): boolean {
  return /^(https?:)?\/\//.test(url);
}

/**
 * 获取域名
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * 拼接路径
 * @param paths 路径片段
 * @returns 完整路径
 *
 * @example
 * ```ts
 * joinPath('/api', 'user', '123')
 * // '/api/user/123'
 * ```
 */
export function joinPath(...paths: string[]): string {
  return paths
    .map((path, index) => {
      // 移除开头的斜杠（除了第一个）
      if (index > 0 && path.startsWith('/')) {
        path = path.slice(1);
      }
      // 移除结尾的斜杠
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      return path;
    })
    .filter(Boolean)
    .join('/');
}
