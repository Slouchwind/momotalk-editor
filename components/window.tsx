import React from 'react';
import Repeat from './repeat';
import { SetStateFun } from '@/lib/extraReact';
import randomId from '@/lib/randomId';

import type { RepeatProps } from './repeat';

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
                        <img src='/api/icon/close?fill=000' onClick={_ => closeWindow()} />
                    </div>
                    <div className='element'>{element(closeWindow)}</div>
                </div>
            )}
        </>);
    }
}

export function AllWindows({ zIndex, allWindow }: {
    zIndex: number,
    allWindow: AllWindow
}) {
    let { all, component } = allWindow;
    if (!all || !component) return null;
    else {
        let window: RepeatProps<number>['components'] = v => {
            let { name, id, display, arg } = all[v];
            let windowComponent = component[name](zIndex + 1 + (2 * v), id, display, arg, all);
            return (
                <div className='window'>
                    <div className='back' style={{ zIndex: zIndex + (2 * v) }} />
                    {windowComponent}
                </div>
            );
        }
        return (
            <Repeat
                variable={0}
                repeat={all.length}
                func={v => v + 1}
                components={window}
            />
        );
    }
}

export function getWindowFun(
    useState: [AllWindow, SetStateFun<AllWindow>]
) {
    const [allWindow, setAllWindow] = useState;
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
        const windows = document.getElementsByClassName('ask');
        const window = windows[windows.length - 1] as HTMLDivElement;
        if (!window) return;
        window.style.animationFillMode = 'forwards';
        window.style.animationName = 'fadeOut';
        window.addEventListener('animationend', () => {
            all = all?.filter(v => v.id !== id);
            setAllWindow({ all });
        });
    };
    return { allWindow, setAllWindow, addNewWindow, openWindow, closeWindow };
}