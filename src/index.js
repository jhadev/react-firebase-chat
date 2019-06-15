import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Firebase, { FirebaseContext } from './components/Firebase/index';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
