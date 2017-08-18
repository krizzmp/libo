import { combineReducers } from 'redux'
import R = require('ramda')
import { EditorState } from 'draft-js'
import { Actions, ActionType } from './actions'
interface ById<T> { [id: string]: T }
export { actionCreators } from './actions'
export interface Box {
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    editorState: EditorState
}
export interface Line {
    id: string,
    from: string,
    to: string
}
type hg<T> = (state: T | undefined, action: Actions) => T

const boxesById: hg<RootState['boxesById']> = (state = {}, action: Actions) => {
    switch (action.type) {
        case ActionType.CreateBox:
            return { ...state, [action.payload.id]: { ...action.payload, w: 0, h: 0 } }
        case ActionType.MoveBox: {
            const { id, x, y } = action.payload
            return R.mergeDeepLeft({ [id]: { x, y } }, state)
        }
        case ActionType.UpdateSize: {
            const { id, w, h } = action.payload
            return R.mergeDeepLeft({ [id]: { w, h } }, state)
        }
        case ActionType.ChangeText: {
            const { id, editorState } = action.payload
            const es = R.lensPath([id, 'editorState'])
            return R.set(es, editorState, state)
        }
    }
    return state
}
const lineList: hg<RootState['lineList']> = (state = [], action) => {
    switch (action.type) {
        case ActionType.CreateLine:
            return [...state, action.payload.id]
    }
    return state
}
const linesById: hg<RootState['linesById']> = (state = {}, action: Actions) => {
    switch (action.type) {
        case ActionType.CreateLine:
            return { ...state, [action.payload.id]: { ...action.payload } }
    }
    return state
}
const boxesList: hg<RootState['boxesList']> = (state = [], action) => {
    switch (action.type) {
        case ActionType.CreateBox:
            return [...state, action.payload.id]
    }
    return state
}
const selectedBox: hg<RootState['selectedBox']> = ((state = '', action) => {
    switch (action.type) {
        case ActionType.SelectBox:
            return action.payload.id
    }
    return state
})
const draggedBox: hg<RootState['draggedBox']> = ((state = { id: '', cx: 0, cy: 0, x: 0, y: 0 }, action) => {
    switch (action.type) {
        case ActionType.StartDragBox:
            return action.payload
        case ActionType.Drop:
            return { id: '', cx: 0, cy: 0, x: 0, y: 0 }
    }
    return state
})

export interface RootState {
    boxesById: ById<Box>,
    boxesList: string[],
    linesById: ById<Line>,
    lineList: string[],
    selectedBox: string,
    draggedBox: { id: string, cx: number, cy: number, x: number, y: number },
}
export const reducer = combineReducers({
    boxesById,
    boxesList,
    linesById,
    lineList,
    selectedBox,
    draggedBox,
})
