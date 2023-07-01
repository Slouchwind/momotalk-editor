import styles from '@/styles/MainNode.module.scss';

import React from 'react';
import Repeat from './repeat';
import { useForm } from 'react-hook-form';
import { SetStateFun } from './extraReact';
import { useRouter } from 'next/router';

interface SettingOption {
    type: string;
    label: string;
    page?: string;
    title?: string;
}

interface OptionSO<T = string> extends SettingOption {
    type: 'option';
    values?: T[];
    defaultValue?: T;
    getValue: (value: T, index: number, array: T[]) => string;
}

interface InputSO extends SettingOption {
    type: 'input';
    defaultValue?: string;
}

type OptionTypes = OptionSO | InputSO;

interface SettingFormProps<N extends string> {
    option: Record<N, OptionTypes>;
    confirm: string;
    onSubmit: (data: Record<N, string>) => any;
    otherButtons?: React.ReactElement;
}

export function SettingForm<N extends string>({ option, confirm, onSubmit, otherButtons }: SettingFormProps<N>) {
    const { register, handleSubmit } = useForm();
    const { pathname } = useRouter();

    let optionArray: (OptionTypes & { name: N })[] = [];
    for (let o in option) {
        let opt: OptionTypes = option[o];
        optionArray.push(Object.assign(opt, { name: o }));
    }
    return (
        <form onSubmit={handleSubmit(data => {
            onSubmit(data as Record<N, string>);
        })} id={styles.settings}>
            <Repeat
                variable={0}
                repeat={optionArray.length}
                func={i => i + 1}
                components={i => {
                    const o = optionArray[i];
                    if (o.page !== undefined && o.page !== pathname) return;
                    return (
                        <label title={o.title}>
                            {o.label}
                            {o.type === 'option' && (
                                <select {...register(o.name)} defaultValue={o.defaultValue}>
                                    {o.values?.map((v, i, a) => (
                                        <option value={v} key={i}>
                                            {o.getValue(v, i, a)}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {o.type === 'input' && (
                                <input {...register(o.name)} defaultValue={o.defaultValue} />
                            )}
                        </label>
                    );
                }}
            />
            <div>
                <button type='submit'>{confirm}</button>
                {otherButtons}
            </div>
        </form>
    )
}

export interface Settings {
    locale?: string;
    animation?: 'none' | 'first' | 'every';
    fontWeight?:
    'thin' |
    'extralight' |
    'light' |
    'normal' |
    'regular' |
    'medium' |
    'demibold' |
    'semibold' |
    'bold' |
    'heavy';
    fileName?: string;
}

export interface SettingArg {
    setting: Settings;
    setSetting: SetStateFun<Settings>;
}

export function getSettingFun(defaultSet?: Settings) {
    function getSetting(): Settings {
        return JSON.parse(window.localStorage.set as string);
    }
    function setSetting(newSet: Partial<Settings>, first?: boolean): void {
        const preSet = first ? {} : getSetting();
        window.localStorage.set = JSON.stringify({ ...preSet, ...newSet });
    }
    function windowOnload() {
        if (window.localStorage.set === undefined && defaultSet !== undefined) setSetting(defaultSet, true);
    }
    return { getSetting, setSetting, windowOnload };
}