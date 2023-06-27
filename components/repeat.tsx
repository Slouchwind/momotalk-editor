import React from 'react';

interface RepeatProps<T> {
    /**自变量初始值 */
    variable: T,
    /**重复次数 */
    repeat: number,
    /**自变量变动 */
    func: (variable: T) => T,
    /**遍历返回 */
    components: (variable: T) => React.ReactNode,
}

export default function Repeat<T>({ variable, repeat, func, components }: RepeatProps<T>) {
    const array = new Array(repeat).fill(null);
    array.forEach((_, i) => {
        array[i] = (
            <React.Fragment key={i}>
                {components(variable)}
            </React.Fragment>
        );
        variable = func(variable);
    });
    return <>{array}</>;
}