import React from 'react';
import fetchByGraphql from './fetchByGraphql';
import fetchByRESTful from './fetchByRESTful';
import cache from './cache';

let SUB_KEY = 0;

/** 如果有dataGetter, 使用dataGetter处理data */
export function fixDataGetter(dataGetter, data) {
  if (typeof dataGetter === 'function') {
    return dataGetter(data);
  }
  return data;
}

/** 同质化服务端数据和本地数据的读写 */
export default function useDen({
  /** memory|graphql|RESTful 强制设定类型, 不根据 gql 或则 url 进行判断 */
  kind,
  /** 不可变数据读写路径 */
  path,
  /** graphql 的 query 或 mutation */
  gql,
  /** RESTful 的 url */
  url,
  /** memory: 请求body中的data */
  data = null,
  /** RESTful: 请求body中的body */
  body = null,
  /** graphql: variables对象 或 RESTful GET URL地址参数 */
  variables = null,
  /** 初始化loading, 默认为true */
  loading,
  /** 初始化错误, 默认为 void 0 */
  error,
  /** axios中的config */
  config,
  /** axios中的method, 默认为 GET */
  method = 'GET',
  /** 数据写入本地 immutable 之前进行的处理 */
  dataGetter,
  /** 乐观数据, 请求返回之前用于渲染的数据, 如果请求返回的数据和乐观数据不一致才会更新界面 */
  optimistic = null,
  /** 请求返回之后使用解析函数的类型, 默认: 'json' */
  responseType = void 0,
  /** 请求返回错误之后使用解析函数的类型, 默认: 'text' */
  responseErrorType = void 0,
  /** 只执行一次 */
  once = false,
  /** 重复间隔 ms, 如果>0ms才会执行 */
  interval = 0,
}) {
  const [value, setValue] = React.useState({ loading: false, error: void 0, data: void 0 });
  const [clearTimer, setClearTimer] = React.useState(void 0);
  let timer = void 0;

  const updateValue = (
    {
      data: nextData = data,
      body: nextBody = body,
      variables: nextVariables = variables,
      loading: nextLoading = loading,
      error: nextError = error,
      optimistic: nextOptimistic = null,
      once: nextOnce = once,
    },
    subKey,
  ) => {
    const key = path.join(',');

    // 若有once, 并且设定了节流器, 则进行拦截
    if (nextOnce && cache.throttles[key]) {
      return;
    }
    // 若无once, 并且设定了节流器, 则清理节流器
    if (!nextOnce && cache.throttles[key]) {
      delete cache.throttles[key];
    }
    // 如果以上条件不满足, 并且没有设定过节流器, 则设定节流器
    else if (!cache.throttles[key]) {
      cache.throttles[key] = true;
    }

    // 根据传入类型来判断 kind
    if (!kind) {
      if (gql) {
        kind = 'graphql';
      } else if (url) {
        kind = 'RESTful';
      } else {
        kind = 'memory';
      }
    }

    // 初始化当前 path 的 use
    if (!cache.setStateFunctions[key]) {
      cache.setStateFunctions[key] = {};
    }

    // 初始化当前use的setState
    if (subKey && !cache.setStateFunctions[key][subKey]) {
      cache.setStateFunctions[key][subKey] = () => {
        setValue(cache.getIn(path));
      };
    }

    // 保存乐观之前的数据, 用于乐观失败还原
    const oldState = cache.getIn(path) || {};

    // 非本地类型, 请求之前设定loading状态
    if (nextOptimistic !== null) {
      cache.setIn(path, { data: fixDataGetter(dataGetter, nextOptimistic), loading: nextLoading, error: nextError });
    } else if (kind !== 'memory') {
      cache.setIn(path, { loading: true });
    }

    // 更新本地状态
    else {
      cache.setIn(path, { data: fixDataGetter(dataGetter, nextData), loading: nextLoading, error: nextError });
    }

    // 同步注册的页面进行更新
    for (const k in cache.setStateFunctions[key]) {
      cache.setStateFunctions[key][k]();
    }

    // 通过请求更新本地状态
    if (kind !== 'memory') {
      let fetchFunction;

      // 根据kind使用graphql或者restful进行请求
      if (kind === 'graphql') {
        fetchFunction = fetchByGraphql;
      } else if (kind === 'RESTful') {
        fetchFunction = fetchByRESTful;
      }
      fetchFunction({
        gql,
        url,
        variables: nextVariables,
        data: nextData,
        body: nextBody,
        path,
        dataGetter,
        optimistic: nextOptimistic,
        oldState,
        method,
        config,
        responseType,
        responseErrorType,
      }).then(() => {
        // 请求完之后更新所有注册过的页面
        for (const k in cache.setStateFunctions[key]) {
          cache.setStateFunctions[key][k]();
        }
      });
    }
  };

  React.useEffect(() => {
    if (cache.isDev && (!path || path.length === 0)) {
      throw new Error('[useDen] path is empty');
    }
    SUB_KEY++;
    const subKey = SUB_KEY;

    updateValue({ once, interval, data, variables, body, loading, error, optimistic }, subKey);

    if (interval > 0) {
      timer = setInterval(() => {
        updateValue({ once, interval, data, variables, body, loading, error, optimistic }, subKey);
      }, interval);

      setClearTimer(() => () => {
        clearInterval(timer);
        timer = void 0;
      });
    } else {
      updateValue({ once, interval, data, variables, body, loading, error, optimistic }, subKey);
    }

    // 当组件释放后, 释放setStateFunctions中的setState
    return () => {
      const key = path.join(',');

      // 清空循环请求
      if (typeof clearTimer === 'function') {
        clearTimer();
      }
      delete cache.setStateFunctions[key][subKey];
    };
  }, [JSON.stringify(path), kind, url, gql, method, once]);
  return [value, updateValue, clearTimer];
}
