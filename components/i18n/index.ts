import { useEffect, useState } from "react";
import { getSettingFun } from "../setting";

export type Locales = 'zh-CN' | 'zh-TW' | 'en-US';

export type i18nContents = Record<string, Record<Locales | string, string>>;

export function fillBlank(i18n: string, ...fills: (string | undefined)[]): string {
    let text = i18n;
    fills.forEach((v, i) => text = text.replace(`$${i}`, v || ''));
    return text;
}

export function useLocale<T extends i18nContents, K extends keyof T>(i18n: T) {
    const [lo, setLo] = useState('');

    const { getSetting } = getSettingFun();
    useEffect(() => setLo(getSetting().locale || window.navigator.language), []);

    function locale(key: K, loc?: string) {
        const i18nAs = i18n as Record<K, Record<string, string>>;
        const localeText = (i18nAs)[key][loc || lo];
        return localeText || (i18nAs)[key]['zh-CN'];
    }
    function localeType<Type extends string>(key: Type, loc?: string) {
        const i18nAs = i18n as Record<Type, Record<string, string>>;
        const localeText = (i18nAs)[key][loc || lo];
        return localeText || (i18nAs)[key]['zh-CN'];
    }

    return { lo, locale, localeType };
}