/** 遍历对象,执行函数 */
export default function runMapFunctions(obj, args = []) {
  if (!obj) {
    return void 0;
  }
  for (const k in obj) {
    if (typeof obj[k] === 'function') {
      obj[k](...args);
    }
  }
}
