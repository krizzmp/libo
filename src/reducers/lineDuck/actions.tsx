import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory()

export const createLine = actionCreator<{
    id: string
    from: string
    to: string
}>("CREATE_LINE")

export const toggleLineType = actionCreator<{
}>("TOGGLE_LINE_TYPE")
