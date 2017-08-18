import actionCreatorFactory from 'typescript-fsa'
import { EditorState } from 'draft-js'

const actionCreator = actionCreatorFactory()

export const createBox = actionCreator<{
    id: string,
    x: number,
    y: number,
}>("CREATE_BOX")
export const moveBox = actionCreator<{
    id: string
    x: number
    y: number
}>("MOVE_BOX")
export const updateSize = actionCreator<{
    id: string;
    w: number;
    h: number;
}>("UPDATE_SIZE")
export const changeText = actionCreator<{
    id: string,
    editorState: EditorState
}>("CHANGE_TEXT")

export const selectBox = actionCreator<{
    id: string,
}>("SELECT_BOX")

export const startDragBox = actionCreator<{
    id: string,
    cx: number,
    cy: number,
    x: number,
    y: number
}>("START_DRAG_BOX")

export const drop = actionCreator<{}>("DROP")
