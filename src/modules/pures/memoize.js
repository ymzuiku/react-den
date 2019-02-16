/** 缓存函数返回值, 如果参数一致, 不进行函数执行 */
export default function memoize(fn) {
  const cache = {};

  return function(...args) {
    const key = JSON.stringify(args);
    let value = cache[key];

    if (!value) {
      value = [fn.apply(this, args)];
      cache[key] = value;
    }
    return value[0];
  };
}
