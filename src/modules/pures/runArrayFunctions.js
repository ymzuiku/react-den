/** 遍历数组,执行函数 */
export default function runArrayFunctions(list, args = []) {
  if (!list) {
    return void 0;
  }
  list.forEach(fn => {
    if (typeof fn === 'function') {
      fn(...args);
    }
  });
}
