export type SetStateFun<S> = (newState: Partial<S>) => void

export function getClassState<S>(
    useState: [S, React.Dispatch<React.SetStateAction<S>>],
    beforeFun?: (state: S) => void,
): [S, SetStateFun<S>] {
    const setState = (newState: Partial<S>) => useState[1]((preState) => {
        const returnState = { ...preState, ...newState };
        beforeFun?.(returnState);
        return returnState;
    });
    return [useState[0], setState];
}