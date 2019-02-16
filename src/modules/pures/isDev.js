/** 是否处于开发环境 */
export default (process && process.env && process.env.NODE_ENV === 'development') || false;
