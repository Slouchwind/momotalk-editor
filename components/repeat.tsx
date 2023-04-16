interface RepeatProps<T> {
    variable: T,
    repeat: number,
    func: (variable: T) => T,
    components: (variable: T) => React.ReactNode,
}

export default function Repeat<T>({ variable, repeat, func, components }: RepeatProps<T>) {
    const array = new Array(repeat).fill(null);
    array.forEach((_, i) => {
        array[i] = components(variable);
        variable = func(variable);
    });
    return <>{array}</>;
}