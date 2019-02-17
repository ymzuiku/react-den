/** 解析url, 插入参数 */
export default function(url, params) {
  // /test-dog/{user}?name&age to /test-dog/xiaoming?name=dog&age=500
  let nextUrl = url;

  if (/\?/.test(nextUrl)) {
    const list = url.split('?');

    for (const k in params) {
      list[1] = list[1].replace(k, `${k}=${params[k]}`);
    }
    list[1] = list[1].replace(/\{/g, '');
    list[1] = list[1].replace(/\}/g, '');
    nextUrl = list[0] + '?' + list[1];
  }
  if (/\{/.test(nextUrl)) {
    for (const k in params) {
      nextUrl = nextUrl.replace(`{${k}}`, `${params[k]}`);
    }
  }
  return nextUrl;
}
