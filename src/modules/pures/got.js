/** 安全获取子对象 */
export default function got(fn) {
  try {
    return fn();
  } catch (error) {
    return void 0;
  }
}
