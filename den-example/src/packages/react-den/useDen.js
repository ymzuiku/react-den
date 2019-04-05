import { useState, useEffect, useRef, useCallback } from 'react';
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
  /** local|graphql|REST 强制设定类型, 不根据 gql 或则 url 进行判断 */
  kind,
  /** 不可变数据读写路径 */
  path,
  /** graphql 的 query 或 mutation */
  gql,
  /** REST 的 url */
  url,
  /** local: 请求body中的data */
  data = null,
  /** REST: 请求body中的body */
  body = null,
  /** graphql: variables对象 或 REST GET URL地址参数 */
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
  /** 注册即请求 */
  fetchAtInit = false,
  /** 重复间隔 ms, 如果>0ms才会执行 */
  interval = 0,
}) {
  const [value, setValue] = useState({ loading: false, error: void 0, data: void 0 });
  const [clearTimer, setClearTimer] = useState(void 0);
  const timer = useRef(void 0);
  const isNeedUpdate = useRef(fetchAtInit);

  const updateValue = useCallback(
    (
      {
        nextData = data,
        nextBody = body,
        nextVariables = variables,
        nextLoading = loading,
        nextError = error,
        nextOnce = once,
        nextOptimistic = optimistic,
      },
      subKey,
    ) => {
      const key = JSON.stringify(path);

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
          kind = 'REST';
        } else {
          kind = 'local';
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

      if (isNeedUpdate.current === false) {
        isNeedUpdate.current = true;
        return;
      }

      // 非本地类型, 请求之前设定loading状态
      if (nextOptimistic !== null) {
        cache.setIn(path, {
          data: fixDataGetter(dataGetter, nextOptimistic),
          loading: nextLoading || false,
          error: nextError,
        });
      } else if (kind !== 'local') {
        cache.setIn(path, { loading: true });
      }

      // 更新本地状态
      else {
        cache.setIn(path, {
          data: fixDataGetter(dataGetter, nextData),
          loading: nextLoading || false,
          error: nextError,
        });
      }

      // 同步注册的页面进行更新
      for (const k in cache.setStateFunctions[key]) {
        cache.setStateFunctions[key][k]();
      }

      // 根据kind使用graphql或者restful进行请求
      if (kind === 'graphql') {
        fetchByGraphql({
          gql,
          variables: nextVariables,
          path,
          dataGetter,
          oldState,
        }).then(() => {
          // 请求完之后更新所有注册过的页面
          for (const k in cache.setStateFunctions[key]) {
            cache.setStateFunctions[key][k]();
          }
        });
      } else if (kind === 'REST') {
        fetchByRESTful({
          url,
          method,
          body: nextBody,
          variables: nextVariables,
          config,
          path,
          dataGetter,
          oldState,
          responseType,
          responseErrorType,
        }).then(() => {
          // 请求完之后更新所有注册过的页面
          for (const k in cache.setStateFunctions[key]) {
            cache.setStateFunctions[key][k]();
          }
        });
      }
    },
  );

  useEffect(() => {
    if (cache.isDev && (!path || path.length === 0)) {
      throw new Error('[useDen] path is empty');
    }
    SUB_KEY++;
    const subKey = SUB_KEY;

    if (interval > 0) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        updateValue({}, subKey);
      }, interval);

      setClearTimer(() => () => {
        clearInterval(timer.current);
        cache.replaceTimer[JSON.stringify(path)] = void 0;
      });
    } else {
      updateValue({}, subKey);
    }

    // 当组件释放后, 释放setStateFunctions中的setState
    return () => {
      const key = JSON.stringify(path);

      // 清空循环请求
      if (typeof clearTimer === 'function') {
        clearTimer();
      }
      delete cache.setStateFunctions[key][subKey];
    };
  }, [once, fetchAtInit, interval, path, updateValue, clearTimer]);

  return [value, updateValue, clearTimer];
}
