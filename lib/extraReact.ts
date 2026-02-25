import { useCallback, useMemo, useState as ReactUseState } from "react";

export type SetStateFun<S> = (newState: Partial<S>) => void

export function useClassState<S>(
    initialState: S,
    beforeFun?: (state: S) => void,
): [S, SetStateFun<S>] {
    const useState = ReactUseState<S>(initialState);
    const setState = useCallback((newState: Partial<S>) => useState[1]((preState) => {
        const returnState = { ...preState, ...newState };
        beforeFun?.(returnState);
        return returnState;
    }), []);
    const classState = useMemo<[S, SetStateFun<S>]>(() => [useState[0], setState], [useState[0]]);
    return classState;
}