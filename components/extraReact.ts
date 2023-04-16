export function useClassState<S>(
    useState: [S, React.Dispatch<React.SetStateAction<S>>]
): [S, (newState: Partial<S>) => void] {
    const setState = (newState: Partial<S>) => useState[1]((preState) => ({ ...preState, ...newState }));
    return [useState[0], setState];
}