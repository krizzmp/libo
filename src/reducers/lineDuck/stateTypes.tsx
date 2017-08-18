
interface Line {
    id: string,
    from: string,
    to: string
}
interface ById<T> { [id: string]: T }

export const lineById: ById<Line> = {}

export const lineList: string[] = []
