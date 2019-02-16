import React from 'react';
import ReactLoadable from 'react-loadable';
import { Route } from 'react-router-dom';

let defaultFallback = <div>loading...</div>;

export function setDefaultFallback(component) {
  defaultFallback = component;
}

/** 传入 ()=> import()函数, 和 fallback */
export default ({ exact, path, loader, isPreload = true, LoadingComponent: fallback }) => {
  const [Component, setComponent] = React.useState(null);

  React.useEffect(() => {
    const Comp = ReactLoadable({
      loader,
      loading: fallback || defaultFallback,
      delay: 250, // 小于250ms不显示loading
      timeout: 10000, // 10秒超时
    });

    if (isPreload) {
      Comp.preload();
    }

    setComponent(() => Comp);
  }, []);

  return <Route exact={exact} path={path} component={Component} />;
};
