import React from 'react';
import ReactDOM from 'react-dom';
import Home from 'src/routers/home/Home';
import * as serviceWorker from 'packages/serviceWorker';

function App() {
  return <Home />;
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
