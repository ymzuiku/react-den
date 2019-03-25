import 'modules/pures/normal.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from 'modules/serviceWorker';
import Home from 'src/Home';

ReactDOM.render(<Home />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
