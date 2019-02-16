import formatNumber from './formatNumber';

/** 传入时间, 再传入一个kind数组,来确定显示那些时间字段
 * kind数组结构: ['年', '月', '日 ', '时', '分', '秒', '毫秒']
 * 如果kind数组内容不等于 void 0, 则保留该字段 */
export default function formatTime(time = new Date(), kind = ['-', '-', ' ', ':', ':', ' ', 'ms'], formatLen = 2) {
  let timeString = '';

  if (!kind || kind.length !== 7) {
    throw new Error(
      `kind need like: \n ['年', '月', '日 ', '时', '分', '秒', '毫秒'] or \n [void 0, '月', '日', '时', '分', void 0, void 0] \n default: ['-', '-', ' ', ':', ':', ' ', 'ms']`,
    );
  }
  if (kind[0] !== void 0) {
    timeString += formatNumber(time.getFullYear(), formatLen) + kind[0];
  }
  if (kind[1] !== void 0) {
    timeString += formatNumber(time.getMonth(), formatLen) + kind[1];
  }
  if (kind[2] !== void 0) {
    timeString += formatNumber(time.getDay(), formatLen) + kind[2];
  }
  if (kind[3] !== void 0) {
    timeString += formatNumber(time.getHours(), formatLen) + kind[3];
  }
  if (kind[4] !== void 0) {
    timeString += formatNumber(time.getMinutes(), formatLen) + kind[4];
  }
  if (kind[5] !== void 0) {
    timeString += formatNumber(time.getSeconds(), formatLen) + kind[5];
  }
  if (kind[6] !== void 0) {
    timeString += formatNumber(time.getMilliseconds(), formatLen === 0 ? 0 : 3) + kind[6];
  }
  return timeString;
}
