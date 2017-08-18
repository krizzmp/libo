import cuid = require('cuid')
import { EditorState, ContentState } from 'draft-js'

export const enum ActionType {
    CreateBox,
    SelectBox,
    StartDragBox,
    MoveBox,
    ChangeText,
    Drop,
    CreateLine,
    UpdateSize
}
interface Action<T extends ActionType, P> {
    type: T,
    payload: P
}
// Action Creators
export const actionCreators = {
    createBox: (x: number, y: number): ActionsMap['createBox'] => ({
        type: ActionType.CreateBox,
        payload: {
            id: cuid(), x, y,
            editorState: EditorState.createWithContent(ContentState.createFromText(''))
        }
    }),
    selectBox: (id: string): ActionsMap['selectBox'] => ({
        type: ActionType.SelectBox,
        payload: { id }
    }),
    startDragBox: (id: string, cx: number, cy: number, x: number, y: number): ActionsMap['startDragBox'] => ({
        type: ActionType.StartDragBox,
        payload: { id, cx, cy, x, y }
    }),
    moveBox: (id: string, x: number, y: number): ActionsMap['moveBox'] => ({
        type: ActionType.MoveBox,
        payload: { id, x, y }
    }),
    changeText: (id: string, editorState: EditorState): ActionsMap['changeText'] => ({
        type: ActionType.ChangeText,
        payload: { id, editorState }
    }),
    drop: (droppedBox: string): ActionsMap['drop'] => ({
        type: ActionType.Drop,
        payload: { droppedBox }
    }),
    createLine: (from: string, to: string): ActionsMap['createLine'] => ({
        type: ActionType.CreateLine,
        payload: {
            id: cuid(),
            from,
            to
        }
    }),
    updateSize: (id: string, w: number, h: number): ActionsMap['updateSize'] => ({
        type: ActionType.UpdateSize,
        payload: {
            id,
            w,
            h
        }
    }),
}
interface Box {
    id: string,
    x: number,
    y: number,
    editorState: EditorState
}
interface ActionsMap {
    createBox: Action<ActionType.CreateBox, Box>,
    selectBox: Action<ActionType.SelectBox, { id: string }>,
    startDragBox: Action<ActionType.StartDragBox, { id: string, cx: number, cy: number, x: number, y: number }>,
    moveBox: Action<ActionType.MoveBox, { id: string, x: number, y: number }>,
    changeText: Action<ActionType.ChangeText, { id: string, editorState: EditorState }>,
    drop: Action<ActionType.Drop, { droppedBox: string }>,
    createLine: Action<ActionType.CreateLine, { id: string, from: string, to: string }>,
    updateSize: Action<ActionType.UpdateSize, { id: string, w: number, h: number }>,
}
export type Actions = ActionsMap[keyof ActionsMap]
