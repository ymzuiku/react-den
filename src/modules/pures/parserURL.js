/** 解析url, 插入参数
 * 将 parserURL('/test-dog/{user}?name&age', {user:'xiaoming', name:'dog', age:500}) 输出 /test-dog/xiaoming?name=dog&age=500
 */
export default function(url, params) {
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
