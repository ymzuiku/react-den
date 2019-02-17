import cache from './cache';
import useDen from './useDen';
import { middlewareAutoLocalStorage, middlewareLog } from './middlewares';
import { initErrorMiddleware, initMiddleware, initStateToImmutable, initDevelopment } from './initer';
import { initGraphqlConfig } from './fetchByGraphql';
import { initRESTfulConfig } from './fetchByRESTful';

export default useDen;

export {
  initStateToImmutable,
  initErrorMiddleware,
  initMiddleware,
  initDevelopment,
  cache,
  useDen,
  middlewareAutoLocalStorage,
  middlewareLog,
  initGraphqlConfig,
  initRESTfulConfig,
};
