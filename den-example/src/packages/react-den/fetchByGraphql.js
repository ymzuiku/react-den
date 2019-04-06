import { request } from 'graphql-request';
import cache from './cache';

function got(fn) {
  try {
    return fn();
  } catch (error) {
    return void 0;
  }
}

export const config = {
  url: '/graphql',
};

/** 初始化 graphql URL */
export function initGraphqlConfig({ url, errorFn }) {
  if (typeof url === 'string') {
    config.url = url;
  } else {
    // eslint-disable-next-line
    throw "[initGraphqlConfig] url typeof is't string";
  }
  if (typeof errorFn === 'function') {
    config.errorFn = errorFn;
  } else {
    // eslint-disable-next-line
    throw "[initGraphqlConfig] errorFn typeof is't function";
  }
  return config;
}

/** 请求数据并且缓存, 并且计算 loading, error, data */
export default function({ gql, variables, path, dataSetter, oldState }) {
  return new Promise(res => {
    try {
      request(config.url, gql, variables)
        .then(data => {
          if (typeof dataSetter === 'function') {
            data = dataSetter(data);
          }
          cache.setIn(path, { data, loading: false, error: void 0 });
          res(cache.state.getIn(path), cache.state);
        })
        .catch(error => {
          const errorMessage = got(() => error.response.errors[0].message);

          cache.errorMiddlewares.forEach(fn => {
            if (typeof fn === 'function') {
              fn(path, cache, error, oldState);
            }
          });
          // 设置错误状态, 还原乐观之前的数据
          cache.setIn(path, { data: oldState.data, loading: false, error: errorMessage });
          res(cache.state.getIn(path), cache.state);
        });
    } catch (error) {
      //
    }
  });
}
