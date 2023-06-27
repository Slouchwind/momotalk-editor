import styles from '@/styles/MainNode.module.scss';

import React, { useEffect, useState } from 'react';
import Repeat from './repeat';
import { useForm } from 'react-hook-form';
import { SetStateFun } from './extraReact';
import { getClassState } from './extraReact';

interface SettingOption {
    type: string;
    label: string;
}

interface OptionSO<T extends string = string> extends SettingOption {
    type: 'option';
    values?: T[];
    defaultValue?: T;
    getValue: (value: T, index: number, array: T[]) => React.ReactNode;
}

type OptionTypes = OptionSO;

interface SettingFormProps<N extends string> {
    option: Record<N, OptionTypes>;
    done: string;
    onSubmit: (data: Record<N, string>) => any;
}

export function SettingForm<N extends string>({ option, done, onSubmit }: SettingFormProps<N>) {
    const { register, handleSubmit } = useForm();
    let optionArray: (OptionTypes & { name: N })[] = [];
    for (let o in option) {
        let opt = option[o];
        optionArray.push(Object.assign(opt, { name: o }));
    }
    return (
        <form onSubmit={handleSubmit(data => {
            const dataKeyAsN = data as Record<N, string>;
            onSubmit(dataKeyAsN);
        })} id={styles.settings}>
            <Repeat
                variable={0}
                repeat={optionArray.length}
                func={i => i + 1}
                components={i => {
                    const o = optionArray[i];
                    return (
                        <label>
                            {o.label}
                            {o.type === 'option' && (
                                <select {...register(o.name)} defaultValue={o.defaultValue}>
                                    {o.values?.map((v, i, a) => (
                                        <React.Fragment key={i}>
                                            {o.getValue(v, i, a)}
                                        </React.Fragment>
                                    ))}
                                </select>
                            )}
                        </label>
                    );
                }}
            />
            <button type='submit'>{done}</button>
        </form>
    )
}

export interface SettingState {
    locale?: string;
    animation?: 'none' | 'first' | 'every';
}

export interface SettingArg {
    setting: SettingState;
    setSetting: SetStateFun<SettingState>;
}

export function useSetting(state?: SettingState) {
    const [setting, setSetting] = getClassState(useState<SettingState>(state || {}));
    useEffect(() => {
        let setting: string = window.localStorage.set;
        if (setting !== undefined) {
            setSetting(JSON.parse(setting));
        }
    }, []);
    return { setting, setSetting };
}