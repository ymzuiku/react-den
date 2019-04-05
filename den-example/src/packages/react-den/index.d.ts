/* eslint-disable */
import { Map } from 'immutable';

/** den 数据 */
interface IValue {
  data: any;
  loading: Boolean;
  error: string | any;
}

interface IMiddlewareParams {
  cache: ICache;
  path: Array<String>;
  oldValue: IValue;
  value: IValue;
}


interface ICache {
  // /** appKey用于本地存储的键 */
  // appKey: String;
  /** 默认 false, 只有处于dev环境才会输出日志和错误提示 */
  isDev: Boolean;
  /** 设置 sessionStorage key, 并且将数据同步在 sessionStorage */
  webDebugToolKey: String;
  /** 整个项目的状态树, 请一直保持为一个 immutable 的 Map */
  state: Map;
  /** 用于跨组件更新状态的函数, 函数针对于 state的路径进行分组 */
  setStateFunctions: Object;
  throttles: Object;
  /** 每当更新时, 都会执行middlewares中的函数 */
  middlewares: Array<IMiddleware>;
  /** 获取cache中的数据, 请传入数组 */
  getIn: (path: Array<Staring>) => IValue;
  /** 使用setIn进行更新数据, 保持每个数据都有 data, loading, error 三个状态 */
  setIn: (path: Array<String>, value: IValue) => any;
  /** 打印整个state, 非常消耗性能 */
  logState: () => any;
  errorMiddlewares: Array<IMiddleware>;
}


interface IUseDenParams {
  /** local|graphql|REST 强制设定类型, 不根据 gql 或则 url 进行判断 */
  kind: 'local' | 'graphql' | 'REST';
  /** 不可变数据读写路径 */
  path: Array<String>;
  /** graphql 的 query 或 mutation */
  gql: String;
  /** REST 的 url */
  url: String;
  /** local: 请求body中的data */
  data: Object;
  /** REST: 请求body中的body */
  body: Object;
  /** graphql: variables对象 或 REST GET URL地址参数 */
  variables: Object;
  /** 初始化loading, 默认为true */
  loading: Boolean;
  /** 初始化错误, 默认为 void 0 */
  error: String;
  /** fetch 中的config */
  config: Object;
  /** fetch 中的method, 默认为 GET */
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' | any;
  /** 数据写入本地 immutable 之前进行的处理 */
  dataGetter: Function;
  /** 乐观数据, 请求返回之前用于渲染的数据, 如果请求返回的数据和乐观数据不一致才会更新界面 */
  optimistic: Object;
  /** 请求返回之后使用解析函数的类型, 默认: 'json' */
  responseType: 'json' | 'text' | any;
  /** 请求返回错误之后使用解析函数的类型, 默认: 'text' */
  responseErrorType: 'json' | 'text' | any;
  /** 只执行一次 */
  once: Boolean;
  /** 重复间隔 ms, 如果>0ms才会执行 */
  interval: Number;
  /** 声明时是否进行更新/请求, default: false */
  updateAtInit: Boolean;
  /** 如果希望只做请求, 不做更新, 设置成 false */
  isSetState: Boolean;
}

interface IUpdateDenParams {
  /**
   * 是否进行请求之后是否更新: default: true
   * 如果有两个 useDen 使用同一个 path, 可以让其他的 useDen 的 isSetState 变为 false, 这样可以减少相同 path 的更新
   * */
  nextIsSetState: Boolean;
  /** 是否进行更新/请求, default: true */
  nextIsUpdate: Boolean;
  /** local: 请求body中的data */
  nextData: Object;
  /** REST: 请求body中的body */
  nextBody: Object;
  /** graphql: variables对象 或 REST GET URL地址参数 */
  nextVariables: Object;
  /** 初始化loading, 默认为true */
  nextLoading: Boolean;
  /** 初始化错误, 默认为 void 0 */
  nextError: String;
  /** 只执行一次 */
  nextOnce: Boolean;
  /** 乐观数据, 请求返回之前用于渲染的数据, 如果请求返回的数据和乐观数据不一致才会更新界面 */
  nextOptimistic: Object;
}

interface IMiddlewareLogParams {
  isHidden: Boolean;
  isFormat: Boolean;
  isSaveLogFunctions: Boolean;
  formatStringMaxLength: Number;
  titleMaxLength: Number;
}

interface IGraphqlConfig {
  url: String;
  errorFn: Function;
}

interface IHeader {
  'Content-Type': String;
}

interface IRESTfulConfig {
  headers: IHeader | Object;
}

declare function IMiddleware (params: IMiddlewareParams): any;

/** 返回 数据, 更新数据函数, 清除 Interval 事件函数 */
declare function useDen(params: IUseDenParams): [IValue, (params: IUpdateDenParams) => void, clearIntervalTimer];

/** 初始化 cache.state 为一个 immutable 对象 */
declare function initStateToImmutable(obj): Map;

/** 添加中间件, 中间件是一个函数, 并且返回一个函数, 在每次更新状态的时候,会执行中间件的返回值, 并且传入上下文状态 */
declare function initMiddleware(middlewares: Array<IMiddleware>, onlyMerge: Boolean): Array<IMiddleware>;

/** 添加处理错误的中间件, 中间件是一个函数, 并且返回一个函数, 在每次获取错误状态的时候,会执行中间件的返回值, 并且传入上下文状态 */
declare function initErrorMiddleware(middlewares: Array<IMiddleware>, onlyMerge: Boolean): Array<IMiddleware>;


/** 打印日志中间件, 默认只在dev环境下打印, 并且不在移动环境下打印 */
declare function middlewareLog(params: IMiddlewareLogParams): void;

/** 用于自动存储的中间件, 传入一个多维数组, 数组每个值都是immutable对象的 getIn 路径 */
declare function middlewareAutoLocalStorage(appKey: String, keys: Array<String | Array<any>>): void;

/** 初始化 graphql URL */
declare function initGraphqlConfig(config: IGraphqlConfig): IGraphqlConfig;

/** 初始化 REST 请求的 options */
declare function initRESTfulConfig(config: IRESTfulConfig): IRESTfulConfig;

declare var cache: ICache;

export default useDen;

export {
  cache,
  initStateToImmutable,
  initMiddleware,
  initErrorMiddleware,
  middlewareLog,
  middlewareAutoLocalStorage,
  initGraphqlConfig,
  initRESTfulConfig,
}


