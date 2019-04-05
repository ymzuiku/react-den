import parserURL from 'pure-fn/lib/parserURL';
import cache from './cache';

export const DEFAULT_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/** 初始化 RESTful请求的 options */
export function initRESTfulConfig(config) {
  for (const k in config) {
    DEFAULT_CONFIG[k] = config[k];
  }
  return DEFAULT_CONFIG;
}

/** 请求数据并且缓存, 并且计算 loading, error, data */
export default function({
  url: uri,
  method,
  body,
  variables,
  config = DEFAULT_CONFIG,
  path,
  dataGetter,
  oldState,
  /** 用于解析body的方法 */
  responseType = 'json',
  /** 用于解析错误情况body的方法 */
  responseErrorType = 'text',
}) {
  return new Promise(resolve => {
    let url;
    let options;

    // 解析url, 插入参数
    if (variables) {
      url = parserURL(uri, variables);
    } else {
      url = uri;
    }

    if (body) {
      options = { ...config, method, body: JSON.stringify(body) };
    } else {
      options = { ...config, method };
    }

    fetch(url, options)
      .then(res => {
        if (res.ok) {
          return { data: res[responseType](), ok: res.ok, status: res.status };
        }
        // 如果异常
        return Promise.reject(res[responseErrorType]());
      })
      .then(res => {
        if (res && res.data && res.data.then) {
          res.data.then(theData => {
            const { ok, status } = res;

            if (typeof dataGetter === 'function') {
              theData = dataGetter(theData);
            }
            cache.setIn(path, { data: theData, loading: false, error: ok ? void 0 : status });
            resolve(cache.state.getIn(path), cache);
          });
        } else {
          let { data: theData } = res;
          const { ok, status } = res;

          if (typeof dataGetter === 'function') {
            theData = dataGetter(theData);
          }
          cache.setIn(path, { data: theData, loading: false, error: ok ? void 0 : status });
          resolve(cache.state.getIn(path), cache);
        }
      })
      .catch(error => {
        if (error.then) {
          error.then(err => {
            cache.errorMiddlewares.forEach(fn => {
              if (typeof fn === 'function') {
                fn(err, cache, path, oldState);
              }
            });
            // 设置错误状态, 还原乐观之前的数据
            cache.setIn(path, { data: oldState.data, loading: false, error: err });
            resolve(cache.state.getIn(path), cache);
          });
        } else {
          cache.errorMiddlewares.forEach(fn => {
            if (typeof fn === 'function') {
              fn(path, cache, error, oldState);
            }
          });
          // 设置错误状态, 还原乐观之前的数据
          cache.setIn(path, { data: oldState.data, loading: false, error });
          resolve(cache.state.getIn(path), cache);
        }
      });
  });
}
