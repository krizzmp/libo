interface Action<T extends string, P> {
    type: T,
    payload: P
}
type Actions = Action<'test', {}>
export const reducer = (state = {}, action: Actions) => (state)