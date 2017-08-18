import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { createLine } from './actions'
import * as initialState from './stateTypes'

export const lineById = reducerWithInitialState(initialState.lineById)
    .case(createLine, (state, payload) => (
        { ...state, [payload.id]: { ...payload } }
    ))

export const lineList = reducerWithInitialState(initialState.lineList)
    .case(createLine, (state, payload) =>
        [...state, payload.id]
    )
