/**
 * 验证工具函数
 * 常用的数据验证方法
 */

/**
 * 验证手机号（中国大陆）
 */
export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value);
}

/**
 * 验证座机号
 */
export function isTel(value: string): boolean {
  return /^0\d{2,3}-?\d{7,8}$/.test(value);
}

/**
 * 验证邮箱
 */
export function isEmail(value: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

/**
 * 验证身份证号（15位或18位）
 */
export function isIdCard(value: string): boolean {
  // 15位或18位
  const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return pattern.test(value);
}

/**
 * 验证URL
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证IP地址（IPv4）
 */
export function isIP(value: string): boolean {
  return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value);
}

/**
 * 验证端口号
 */
export function isPort(value: string | number): boolean {
  const port = Number(value);
  return Number.isInteger(port) && port >= 0 && port <= 65535;
}

/**
 * 验证中文
 */
export function isChinese(value: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(value);
}

/**
 * 验证英文
 */
export function isEnglish(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * 验证数字
 */
export function isNumber(value: string | number): boolean {
  return /^\d+$/.test(String(value));
}

/**
 * 验证整数
 */
export function isInteger(value: string | number): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 验证正整数
 */
export function isPositiveInteger(value: string | number): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

/**
 * 验证小数
 */
export function isDecimal(value: string | number): boolean {
  return /^\d+\.\d+$/.test(String(value));
}

/**
 * 验证密码强度
 * @param value 密码
 * @param level 强度等级（1-3）
 * @returns 是否符合强度要求
 *
 * level 1: 至少6位
 * level 2: 至少6位，包含数字和字母
 * level 3: 至少8位，包含数字、字母、特殊字符
 */
export function isPassword(value: string, level: 1 | 2 | 3 = 1): boolean {
  switch (level) {
    case 1:
      return value.length >= 6;
    case 2:
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
    case 3:
      return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
    default:
      return false;
  }
}

/**
 * 验证银行卡号
 */
export function isBankCard(value: string): boolean {
  return /^[1-9]\d{9,29}$/.test(value);
}

/**
 * 验证车牌号
 */
export function isCarNumber(value: string): boolean {
  // 新能源车牌
  const newEnergyPattern =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-DF-HJ-NP-Z0-9]{5}[DF]$/;
  // 普通车牌
  const normalPattern =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-DF-HJ-NP-Z0-9]{5}$/;

  return newEnergyPattern.test(value) || normalPattern.test(value);
}

/**
 * 验证QQ号
 */
export function isQQNumber(value: string): boolean {
  return /^[1-9][0-9]{4,10}$/.test(value);
}

/**
 * 验证微信号
 */
export function isWechatId(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(value);
}

/**
 * 验证邮政编码
 */
export function isPostCode(value: string): boolean {
  return /^[1-9]\d{5}$/.test(value);
}

/**
 * 验证是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证长度范围
 */
export function isLengthInRange(value: string, min: number, max: number): boolean {
  const length = value.length;
  return length >= min && length <= max;
}

/**
 * 验证数值范围
 */
export function isNumberInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证是否包含特殊字符
 */
export function hasSpecialChar(value: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(value);
}

/**
 * 验证是否只包含字母和数字
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * 自定义验证
 * @param value 值
 * @param pattern 正则表达式
 */
export function matchPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}
