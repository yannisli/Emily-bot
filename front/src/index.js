import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import core from './reducers/core';
import messages from './reducers/messages';
let combined = combineReducers({
    core: core,
    messages: messages
});

let store = createStore(combined);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
