import { Map } from 'immutable';

/** 如果子路径没有,就补齐子路径  */
function fullPathWithImmutable(obj, path) {
  const list = [];

  for (let i = 0; i < path.length - 2; i++) {
    list.push(path[i]);
    if (!obj.getIn(list)) {
      obj.setIn(list, {});
    }
  }
}

const initCache = {
  isClearOldStorage: false,
};

const cache = {
  // /** appKey用于本地存储的键 */
  // appKey: 'react-den-default-appKey',
  /** 默认 false, 只有处于dev环境才会输出日志和错误提示 */
  isDev: false,
  /** 设置 sessionStorage key, 并且将数据同步在 sessionStorage */
  webDebugToolKey: void 0,
  /** 整个项目的状态树, 请一直保持为一个 immutable 的 Map */
  state: Map({}),
  /** 用于跨组件更新状态的函数, 函数针对于 state的路径进行分组 */
  setStateFunctions: {},
  throttles: {},
  replaceTimer: {},
  /** 每当更新时, 都会执行middlewares中的函数 */
  middlewares: [],
  /** 获取cache中的数据, 请传入数组 */
  getIn: path => {
    return cache.state.getIn(path);
  },
  /** 使用setIn进行更新数据, 保持每个数据都有 data, loading, error 三个状态 */
  setIn: (path, { data = null, loading = false, error = void 0 }) => {
    const oldValue = cache.state.getIn(path);

    if (data === null) {
      data = oldValue && oldValue.data;
    }

    const value = { data, loading, error };

    if (!oldValue) {
      fullPathWithImmutable(cache.state, path);
    }

    if (oldValue === void 0 || (oldValue !== data && JSON.stringify(oldValue) !== JSON.stringify(value))) {
      cache.state = cache.state.setIn(path, {
        data,
        loading,
        error,
      });
      cache.middlewares.forEach(fn => {
        fn(path, cache, oldValue, value);
      });
    }

    if (cache.webDebugToolKey) {
      const session = {};

      cache.state.forEach((v, k) => {
        session[k] = v;
      });
      // 初始化时清除历史debug记录
      if (!initCache.isClearOldStorage) {
        window.sessionStorage.setItem(cache.webDebugToolKey, '{}');
        initCache.isClearOldStorage = true;
      }
      window.sessionStorage.setItem(cache.webDebugToolKey, JSON.stringify(session));
    }
  },
  /** 打印整个state, 非常消耗性能 */
  logState: () => {
    if (cache.isDev) {
      // eslint-disable-next-line
      console.log(cache.state.toJS());
    }
  },
  errorMiddlewares: [],
};

export default cache;
