import React from 'react';
import { HashRouter, Redirect, Switch } from 'react-router-dom';
import LazyRoute from 'modules/react-route-lazy';
import history from 'src/tools/history';

export default () => {
  return (
    <HashRouter history={history}>
      <Switch>
        <Redirect exact path="/" from="/" to="/welcome/" />
        <LazyRoute exact path="/welcome/*" loader={() => import('./Welcome/Welcome')} />
        <LazyRoute exact path="/document/*" loader={() => import('./Document/Document')} />
      </Switch>
    </HashRouter>
  );
};
