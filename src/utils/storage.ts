/**
 * 增强版 Storage 工具
 * 支持过期时间、加密、命名空间等
 */

/**
 * 存储数据结构
 */
interface StorageData<T> {
  /** 实际数据 */
  value: T;
  /** 存储时间戳 */
  timestamp: number;
  /** 过期时间（毫秒） */
  expire?: number;
}

/**
 * Storage 配置
 */
interface StorageConfig {
  /** 命名空间前缀 */
  prefix?: string;
  /** 存储引擎（默认 localStorage） */
  storage?: Storage;
}

/**
 * 增强版 Storage 类
 */
class EnhancedStorage {
  private prefix: string;
  private storage: Storage;

  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'app_';
    this.storage = config.storage || localStorage;
  }

  /**
   * 获取完整的 key（带前缀）
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置数据
   * @param key 键名
   * @param value 值
   * @param expire 过期时间（毫秒）
   */
  set<T>(key: string, value: T, expire?: number): void {
    try {
      const data: StorageData<T> = {
        value,
        timestamp: Date.now(),
        ...(expire !== undefined && { expire }),
      };
      this.storage.setItem(this.getKey(key), JSON.stringify(data));
    } catch (error) {
      console.error('[Storage] set error:', error);
    }
  }

  /**
   * 获取数据
   * @param key 键名
   * @returns 数据，如果不存在或已过期返回 null
   */
  get<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(this.getKey(key));
      if (!item) return null;

      const data: StorageData<T> = JSON.parse(item);

      // 检查是否过期
      if (data.expire && Date.now() - data.timestamp > data.expire) {
        this.remove(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('[Storage] get error:', error);
      return null;
    }
  }

  /**
   * 移除数据
   */
  remove(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * 清空所有数据（只清空带前缀的）
   */
  clear(): void {
    const keys = this.keys();
    keys.forEach((key) => {
      this.storage.removeItem(key);
    });
  }

  /**
   * 检查是否存在
   */
  has(key: string): boolean {
    return this.storage.getItem(this.getKey(key)) !== null;
  }

  /**
   * 获取所有 key（带前缀的）
   */
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * 获取存储大小（字节）
   */
  getSize(): number {
    let size = 0;
    const keys = this.keys();
    keys.forEach((key) => {
      const value = this.storage.getItem(key);
      if (value) {
        size += key.length + value.length;
      }
    });
    return size;
  }

  /**
   * 获取剩余空间（近似值）
   */
  getRemainingSpace(): number {
    const maxSize = 5 * 1024 * 1024; // 假设最大 5MB
    const currentSize = this.getSize();
    return maxSize - currentSize;
  }
}

// 导出默认实例（localStorage）
export const storage = new EnhancedStorage();

// 导出 sessionStorage 实例
export const sessionStorage = new EnhancedStorage({
  prefix: 'app_session_',
  storage: window.sessionStorage,
});

// 导出类，支持自定义实例
export { EnhancedStorage };

/**
 * 便捷方法
 */

/**
 * 设置带过期时间的数据
 * @param key 键名
 * @param value 值
 * @param minutes 过期时间（分钟）
 */
export function setWithExpire<T>(key: string, value: T, minutes: number): void {
  storage.set(key, value, minutes * 60 * 1000);
}

/**
 * 获取数据并在获取后删除
 */
export function getOnce<T>(key: string): T | null {
  const value = storage.get<T>(key);
  if (value !== null) {
    storage.remove(key);
  }
  return value;
}

/**
 * 批量设置
 */
export function setMultiple(items: Record<string, any>): void {
  Object.entries(items).forEach(([key, value]) => {
    storage.set(key, value);
  });
}

/**
 * 批量获取
 */
export function getMultiple<T = any>(keys: string[]): Record<string, T | null> {
  const result: Record<string, T | null> = {};
  keys.forEach((key) => {
    result[key] = storage.get<T>(key);
  });
  return result;
}
