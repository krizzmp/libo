import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { createLine, toggleLineType } from './actions'
import * as initialState from './stateTypes'

export const lineById = reducerWithInitialState(initialState.lineById)
    .case(createLine, (state, payload) => (
        { ...state, [payload.id]: { ...payload } }
    ))

export const lineList = reducerWithInitialState(initialState.lineList)
    .case(createLine, (state, payload) =>
        [...state, payload.id]
    )

export const lineType = reducerWithInitialState(initialState.lineType)
    .case(toggleLineType, (state, payload) =>
        !state
    )
