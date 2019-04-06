import storage from 'pure-fn/lib/storage';
import formatTime from 'pure-fn/lib/formatTime';
import globalCache from './cache';

export const middlewareListener = {
  isUseMiddlewareLog: false,
  isUseMiddlewareAutoLocalStorage: false,
};

/** 打印日志中间件, 默认只在dev环境下打印, 并且不在移动环境下打印 */
export function middlewareLog({
  isHidden = false,
  isFormat = true,
  isSaveLogFunctions = true,
  formatStringMaxLength = 500,
  titleMaxLength = 60,
}) {
  // 防止此中间键被重复注册
  if (middlewareListener.isUseMiddlewareLog) {
    return void 0;
  }
  middlewareListener.isUseMiddlewareLog = true;

  window.denLogList = [];
  window.denLog = function(len = window.denLogList.length, format) {
    window.denLogList.forEach((fn, i) => {
      if (i >= window.denLogList.length - len && typeof fn === 'function') {
        fn(format);
      }
    });
  };
  return (path, cache, lastState, nextState) => {
    if (cache.isDev) {
      const log = (format = true) => {
        const timeString = formatTime(void 0, [void 0, void 0, void 0, ':', ':', ' ', 'ms']);
        const key = JSON.stringify(path);
        const loading = nextState && nextState.loading;
        const error = nextState && nextState.error;
        let statusString = '';

        // 计算是否显示loading或则error
        if (loading) {
          statusString += `,  loading: ${loading}`;
        }
        if (error) {
          statusString += `,  error: ${error}`;
        }

        // 用于打印title上的数据片段, 为了节约空间, 去除引号, 并且只打印 data
        const nextTitleString = JSON.stringify((nextState && nextState.data) || '').replace(/"/g, '');

        if (nextTitleString) {
          // eslint-disable-next-line
          console.groupCollapsed(
            `%c|-- ${timeString}  [${key}]${statusString},  data: ${nextTitleString.substr(0, titleMaxLength)}${
              nextTitleString.length > titleMaxLength ? '...' : ''
            } `,
            `background: rgb(70, 70, 70); color: rgb(240, 235, 200);margin:2px; padding: 3px; border-radius: 3px;`,
          );
        } else {
          // eslint-disable-next-line
          console.groupCollapsed(
            `%c|-- ${timeString}  [${key}]${statusString}`,
            `background: rgb(70, 70, 70); color: rgb(240, 235, 200);margin:2px; padding: 3px; border-radius: 3px;`,
          );
        }

        let lastStateLogObj = lastState;
        let nextStateLogObj = nextState;

        if (format) {
          const lastStateString = JSON.stringify(lastStateLogObj || 'undefined', void 0, 2);
          const nextStateString = JSON.stringify(nextStateLogObj || 'undefined', void 0, 2);

          if (lastStateString.length < formatStringMaxLength) {
            lastStateLogObj = lastStateString;
          }
          if (nextStateString.length < formatStringMaxLength) {
            nextStateLogObj = nextStateString;
          }
        }
        /* eslint-disable */
        console.log('|--last', lastStateLogObj);
        console.log('|--next', nextStateLogObj);
        try {
          console.groupCollapsed('|--trace');
          console.trace(`|-- function tree`);
          console.groupEnd();
        } catch (error) {
          //
        }
        console.groupEnd();
        /* eslint-enable */
      };

      if (!isHidden) {
        log(isFormat);
      }

      if (isSaveLogFunctions) {
        window.denLogList.push(log);
      }
    }
  };
}

/** 用于自动存储的中间件, 传入一个多维数组, 数组每个值都是immutable对象的 getIn 路径 */
export function middlewareAutoLocalStorage(appKey = 'react-den-key-need-replace', keys = []) {
  // 防止此中间键被重复注册
  if (middlewareListener.isUseMiddlewareAutoLocalStorage) {
    return void 0;
  }
  middlewareListener.isUseMiddlewareAutoLocalStorage = true;

  function pathToKey(path) {
    return `-${JSON.stringify(path)}`;
  }

  const pathKeys = keys.map(v => {
    if (typeof v === 'string') {
      return [v];
    }
    return v;
  });

  storage.localName = appKey;

  const localState = storage.load() || {};

  // 将历史的数据保存到 cache.state 中
  for (const k in localState) {
    const v = localState[k];

    pathKeys.forEach(watchPath => {
      if (pathToKey(watchPath) === k) {
        globalCache.state = globalCache.state.setIn(watchPath, v);
      }
    });
  }

  return () => {
    pathKeys.forEach(watchPath => {
      const watchString = pathToKey(watchPath);
      const oldData = localState[watchString];
      const nextData = globalCache.getIn(watchPath);

      // immutable 比较, 如果变化了就保存
      if (oldData !== nextData) {
        localState[watchString] = nextData;
        storage.save(localState);
      }
    });
  };
}
