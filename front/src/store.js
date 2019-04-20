import { createStore, combineReducers } from 'redux';

import core from './reducers/core';
import messages from './reducers/messages';
let combined = combineReducers({
    core: core,
    messages: messages
});


let store = createStore(combined);

export default store;