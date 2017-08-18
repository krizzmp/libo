import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Hello } from "./components/Hello"
import { reducers } from './reducers/index'
const store = createStore(reducers)
ReactDOM.render(
    <Provider store={store}>
        <Hello />
    </Provider>
    ,
    document.getElementById("example"),
)
