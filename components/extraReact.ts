export type SetStateFun<S> = (newState: Partial<S>) => void

export function getClassState<S>(
    useState: [S, React.Dispatch<React.SetStateAction<S>>]
): [S, SetStateFun<S>] {
    const setState = (newState: Partial<S>) => useState[1]((preState) => ({ ...preState, ...newState }));
    return [useState[0], setState];
}