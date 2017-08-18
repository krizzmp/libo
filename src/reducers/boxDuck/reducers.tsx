import { reducerWithInitialState } from 'typescript-fsa-reducers'
import * as R from 'ramda'
import { createBox, moveBox, updateSize, changeText, startDragBox, drop, selectBox } from './actions'
import * as initialState from './stateTypes'
import { EditorState, ContentState } from 'draft-js'

export const boxById = reducerWithInitialState(initialState.boxById)
    .case(createBox, (state, payload) => (
        {
            ...state,
            [payload.id]: {
                ...payload,
                w: 0,
                h: 0,
                editorState: EditorState.createWithContent(ContentState.createFromText(''))
            }
        }
    ))
    .case(moveBox, (state, { id, x, y }) =>
        R.mergeDeepLeft({ [id]: { x, y } }, state)
    )
    .case(updateSize, (state, { id, w, h }) =>
        R.mergeDeepLeft({ [id]: { w, h } }, state)
    )
    .case(changeText, (state, { id, editorState }) =>
        R.set(R.lensPath([id, 'editorState']), editorState, state)
    )

export const boxList = reducerWithInitialState(initialState.boxList)
    .case(createBox, (state, payload) =>
        [...state, payload.id]
    )

export const selectedBox = reducerWithInitialState(initialState.selectedBox)
    .case(selectBox, (state, payload) =>
        payload.id
    )

export const draggedBox = reducerWithInitialState(initialState.draggedBox)
    .case(startDragBox, (state, payload) =>
        payload
    )
    .case(drop, (state, payload) =>
        ({ id: '', cx: 0, cy: 0, x: 0, y: 0 })
    )