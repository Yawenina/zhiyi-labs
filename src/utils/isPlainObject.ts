/**
 * What is a plain object?
 * created by object literal: { foo: 'bar' }
 * created by new Object()
 * created by Object.create(null)
 */
export default function isPlainObject(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;

  // Object.create(null)
  if (Object.getPrototypeOf(obj) === null) return true;

  /**
   * 如果是 plainObject, 那么 Object.getPrototypeOf 一层就应该和对象本来的一样;
   * 使用这种方式判断而不是 Object.getPrototypeOf(obj) === Object.prototype
   * 因为不同上下文(iframe) 的 Object.prototype 不一样：https://github.com/reduxjs/redux/issues/304
   */
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}