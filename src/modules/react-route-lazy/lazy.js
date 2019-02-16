import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';

let defaultFallback = <div>loading...</div>;

export function setDefaultFallback(component) {
  defaultFallback = component;
}

/** 传入 ()=> import()函数, 和 fallback */
function LazyRoute({ exact, path, loader, fallback = defaultFallback, ...rest }) {
  const [Component, setComponent] = React.useState(null);

  React.useEffect(() => {
    const SubComponent = lazy(loader);

    setComponent(() => props => (
      <Suspense fallback={fallback} {...props}>
        <SubComponent />
      </Suspense>
    ));
  }, []);
  return <Route exact={exact} path={path} component={Component} {...rest} />;
}

export default LazyRoute;
