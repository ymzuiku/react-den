import { Map } from 'immutable';
import cache from './cache';

/** 初始化 cache.state 为一个 immutable 对象 */
export function initStateToImmutable(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new Error('[initStateToImmutable] params need a Object');
  }
  cache.state = Map(obj);
  return cache.state;
}

/** 添加中间件, 中间件是一个函数, 并且返回一个函数, 在每次更新状态的时候,会执行中间件的返回值, 并且传入上下文状态 */
export function initMiddleware(middlewares = [], isMerge) {
  if (isMerge) {
    cache.middlewares = [...cache.middlewares, ...middlewares].filter(Boolean);
  } else {
    cache.middlewares = middlewares.filter(Boolean);
  }
  return cache.middlewares;
}

/** 添加处理错误的中间件, 中间件是一个函数, 并且返回一个函数, 在每次更新状态的时候,会执行中间件的返回值, 并且传入上下文状态 */
export function initErrorMiddleware(middlewares, isMerge) {
  if (isMerge) {
    cache.errorMiddlewares = [...cache.errorMiddlewares, ...middlewares];
  } else {
    cache.errorMiddlewares = middlewares;
  }
  return cache.errorMiddlewares;
}

/** 初始化development状态, 打开打印及错误日志 */
export function initDevelopment(isDev) {
  cache.isDev = isDev;
}
