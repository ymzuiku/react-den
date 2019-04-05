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

const IMiddleware = (params: IMiddlewareParams) => any;

interface ICache {
  // /** appKey用于本地存储的键 */
  // appKey: String;
  /** 默认 false, 只有处于dev环境才会输出日志和错误提示 */
  isDev: Boolean;
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

export const cache: ICache;

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
  /** axios中的config */
  config: Object;
  /** axios中的method, 默认为 GET */
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
  /** 初始化即请求 */
  fetchAtInit: Boolean;
}

interface IUpdateDenParams {
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
  optimistic: Object;
}

/** 返回 数据, 更新数据函数, 清除 Interval 事件函数 */
export default function useDen(params: IUseDenParams): [IValue, (params: IUpdateDenParams) => void, clearIntervalTimer];

export function useDen(params: IUseDenParams): [IValue, (params: IUpdateDenParams) => void, clearIntervalTimer];

/** 初始化 cache.state 为一个 immutable 对象 */
export function initStateToImmutable(obj): Map;

/** 添加中间件, 中间件是一个函数, 并且返回一个函数, 在每次更新状态的时候,会执行中间件的返回值, 并且传入上下文状态 */
export function initMiddleware(middlewares: Array<IMiddleware>, onlyMerge: Boolean): Array<IMiddleware>;

/** 添加处理错误的中间件, 中间件是一个函数, 并且返回一个函数, 在每次获取错误状态的时候,会执行中间件的返回值, 并且传入上下文状态 */
export function initErrorMiddleware(middlewares: Array<IMiddleware>, onlyMerge: Boolean): Array<IMiddleware>;

interface IGraphqlConfig {
  url: String;
  errorFn: Function;
}

interface IMiddlewareLogParams {
  isHidden: Boolean;
  isFormat: Boolean;
  isSaveLogFunctions: Boolean;
  formatStringMaxLength: Number;
  titleMaxLength: Number;
}

/** 打印日志中间件, 默认只在dev环境下打印, 并且不在移动环境下打印 */
export function middlewareLog(params: IMiddlewareLogParams): void;

/** 用于自动存储的中间件, 传入一个多维数组, 数组每个值都是immutable对象的 getIn 路径 */
export function middlewareAutoLocalStorage(appKey: String, keys: Array<String | Array<String>>): void;

/** 初始化 graphql URL */
export function initGraphqlConfig(config: IGraphqlConfig): IGraphqlConfig;

interface IHeader {
  'Content-Type': String;
}

interface IRESTfulConfig {
  headers: IHeader | Object;
}

/** 初始化 REST 请求的 options */
export function initRESTfulConfig(config: IRESTfulConfig): IRESTfulConfig;

/** 初始化development状态, 打开打印及错误日志 */
export function initDevelopment(): Array<IMiddleware>;

