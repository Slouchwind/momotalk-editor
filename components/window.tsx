import React from "react";
import Repeat from "./repeat";
import { getClassState } from './extraReact';
import randomId from "./randomId";

interface WindowProps<C> {
    /**标题 */
    title: string;
    /**关闭窗口时调用的函数 */
    closeWindow: () => C;
    /**窗口渲染的元素 */
    element: (closeWindow: () => C) => React.ReactNode;
    /**窗口zIndex */
    zIndex: number;
    /**窗口是否显示 */
    display: boolean;
}

interface WindowTypeAll {
    name: string,
    id: string,
    display: boolean,
    arg: any
}

type WindowTypeComArg<A> = (
    zIndex: number,
    id: string,
    display: boolean,
    arg: A,
    all: AllWindow['all']
) => React.ReactNode;

export interface AllWindow {
    all?: WindowTypeAll[];
    component?: {
        [x: string]: WindowTypeComArg<any>
    };
}

export default class Window<A> {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    Component<C>({ closeWindow, element, zIndex, display, title }: WindowProps<C>) {
        return (<>
            {display && (
                <div className='ask' style={{ zIndex }}>
                    <div className='up'>
                        <h2>{title}</h2>
                        <p onClick={_ => closeWindow()}>x</p>
                    </div>
                    <div
                        className='element'
                        children={element(closeWindow)}
                    />
                </div>
            )}
        </>);
    }
}

export function AllWindows({ zIndex, allWindow }: {
    zIndex: number,
    allWindow: AllWindow
}) {
    if (allWindow.all?.length !== 0)
        return (<>
            <Repeat
                variable={0}
                repeat={allWindow.all?.length || 0}
                func={v => v + 1}
                components={v => {
                    if (allWindow.component && allWindow.all)
                        return (
                            <React.Fragment key={allWindow.all[v].id}>
                                <div className='back' style={{ zIndex: zIndex + (2 * v) }} />
                                {allWindow.component[allWindow.all[v].name](
                                    zIndex + 1 + (2 * v),
                                    allWindow.all[v].id,
                                    allWindow.all[v].display,
                                    allWindow.all[v].arg,
                                    allWindow.all
                                )}
                            </React.Fragment>
                        );
                }}
            />
        </>);
    return null;
}

export function getWindowFun(
    useState: [AllWindow, React.Dispatch<React.SetStateAction<AllWindow>>]
) {
    const [allWindow, setAllWindow] = getClassState(useState);
    function addNewWindow<A>(
        window: Window<A>,
        Component: WindowTypeComArg<A>
    ) {
        let component = allWindow.component || {};
        component[window.name] = Component;
        return setAllWindow({ component });
    };
    function openWindow<A>(all: AllWindow['all'], window: Window<A>, arg: A) {
        const { name } = window;
        all?.push({ name, id: randomId(), display: true, arg });
        setAllWindow({ all });
    };
    const closeWindow = (all: AllWindow['all'], id: string) => {
        all = all?.filter(v => v.id !== id);
        setAllWindow({ all });
    };
    return { allWindow, setAllWindow, addNewWindow, openWindow, closeWindow };
}