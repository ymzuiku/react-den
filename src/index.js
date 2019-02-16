import 'modules/pures/normal.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from 'modules/serviceWorker';
import Routers from 'src/routers/Routers';

ReactDOM.render(<Routers />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
