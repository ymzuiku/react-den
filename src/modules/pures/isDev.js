import memoize from './memoize';

/** 是否处于开发环境 */
export default memoize(() => {
  return (process && process.env && process.env.NODE_ENV === 'development') || false;
});
