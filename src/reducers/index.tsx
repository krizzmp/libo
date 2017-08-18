import * as box from './boxDuck'
import * as line from './lineDuck'
import { combineReducers } from 'redux'

export const stateTypes = { ...box.stateTypes, ...line.stateTypes }

export const actions = { ...box.actions, ...line.actions }

const reducerMap = { ...box.reducers, ...line.reducers }
export const reducers = combineReducers<typeof reducerMap>(reducerMap)
