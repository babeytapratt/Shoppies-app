// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css' ;


// ReactDOM.render(<App />, document.getElementById('root'));

// import React from 'react';
// import ReactDOM from 'react-dom';


// ReactDOM.render(<App />, document.querySelector('#root'));

import React from 'react';
import './sassStyles/_global.scss';
import './sassStyles/_typography.scss';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import searchReducer from './store/reducers/searchReducer';
import nominateReducer from './store/reducers/nominateReducer';
import winnerReducer from './store/reducers/winnerReducer';

const composeEnhancers = (process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose;


const rootReducer = combineReducers({
  search: searchReducer,
  nominate: nominateReducer,
  winner: winnerReducer
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
