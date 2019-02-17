import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as effects from 'redux-saga/effects';
import isDev from 'modules/pures/isDev';

function reducerInAction(state, action) {
  if (typeof action === 'function') {
    return action(state);
  }
  return state;
}

// 通过sagaActions 绑定 sagaMiddleware
function runSagaMiddleware(sagaMiddleware, sagaActions) {
  // 根据 sagaMaps 中的 action 获取 sagaList，并且 takeEvery action中的 type
  const sagasList = [];

  for (const k in sagaActions) {
    const sagaAction = sagaActions[k]();

    if (typeof sagaAction.saga === 'function') {
      sagasList.push(
        (function*() {
          yield effects.takeEvery(sagaAction.type, sagaAction.saga(effects));
        })(),
      );
    }
  }
  sagaMiddleware.run(function*() {
    yield effects.all(sagasList);
  });
}

// use saga and reducer createStore
/**
 * 创建store
 * @param  {object} sagaMaps=reducerInAction
 * @param  {Function} reducers=reducerInAction
 */
export default function createStoreWithSaga(sagaActions, isUseReduxTools = isDev()) {
  let reduxTools;

  if (isUseReduxTools && typeof window !== 'undefined') {
    // eslint-disable-next-line
    reduxTools = window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  }
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducerInAction,
    compose(
      applyMiddleware(sagaMiddleware),
      reduxTools,
    ),
  );

  runSagaMiddleware(sagaMiddleware, sagaActions);
  return store;
}
