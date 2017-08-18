import { EditorState } from 'draft-js'

interface Box {
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    editorState: EditorState
}
interface ById<T> { [id: string]: T }

export const boxById: ById<Box> = {}

export const boxList: string[] = []

export const selectedBox: string = ''
export const draggedBox: {
    id: string,
    cx: number,
    cy: number,
    x: number,
    y: number
} = { id: '', cx: 0, cy: 0, x: 0, y: 0 }
