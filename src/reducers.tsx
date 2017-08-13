import { combineReducers } from 'redux'
import cuid = require('cuid')

type ById<T> = { [id: string]: T }

const enum ActionType {
    CreateBox,
    SelectBox
}
interface Action<T extends ActionType, P> {
    type: T,
    payload: P
}
// Action Creators
export const actionCreators = {
    createBox: (x: number, y: number): Action<ActionType.CreateBox, { box: Box }> => ({
        type: ActionType.CreateBox,
        payload: { box: { id: cuid(), x, y } }
    }),
    selectBox: (id: string): Action<ActionType.SelectBox, { id: string }> => ({
        type: ActionType.SelectBox,
        payload: { id }
    })
}
interface Box {
    id: string,
    x: number,
    y: number
}

type Actions = Action<ActionType.CreateBox, { box: Box }> | Action<ActionType.SelectBox, { id: string }>
type BoxesState = ById<Box>
const boxesById = (state: BoxesState = {}, action: Actions): BoxesState => {
    switch (action.type) {
        case ActionType.CreateBox:
            return { ...state, [action.payload.box.id]: { ...action.payload.box } };
    }
    return state
}
const boxesList = (state: string[] = [], action: Actions): string[] => {
    switch (action.type) {
        case ActionType.CreateBox:
            return [...state, action.payload.box.id];
    }
    return state
}
type reducerType<T> = (state: T, action: Actions) => T
function mr<T>(fn: (state: T, action: Actions) => T): (state: T, action: Actions) => T {
    return fn
}
const selectedBox = mr<string>((state = '', action) => {
    switch (action.type) {
        case ActionType.SelectBox:
            return action.payload.id;
    }
    return state
}
)

export type RootState = {
    boxesById: BoxesState,
    boxesList: string[],
    selectedBox: string
};
export const reducer = combineReducers({
    boxesById,
    boxesList,
    selectedBox
})