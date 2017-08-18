import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory()

export const createLine = actionCreator<{
    id: string
    from: string
    to: string
}>("CREATE_LINE")