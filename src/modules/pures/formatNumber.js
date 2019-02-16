/** 给数字转为001, 002的字符串, 长度为len, 默认为2 */
export default (num, len = 2) => {
  const pow = 10 ** len;

  if (num > pow) {
    return num;
  }
  num = String(pow + num);
  num = num.substr(1);
  return num;
};
