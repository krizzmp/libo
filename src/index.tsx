import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Hello } from "./components/Hello";
import { reducer } from './reducers'
const store = createStore(reducer)
ReactDOM.render(
    <Provider store={store}>
        <Hello />
    </Provider>
    ,
    document.getElementById("example")
);