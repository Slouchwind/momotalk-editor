import { useEffect, useState } from "react";
import { useSetting } from "../setting";

export type Locales = 'zh-CN' | 'zh-TW';

export type i18nContents = Record<string, Record<Locales, string>>;

export function fillBlank(i18n: string, ...fills: (string | undefined)[]): string {
    let text = i18n;
    fills.forEach((v, i) => text = text.replace(`$${i}`, v || ''));
    return text;
}

export function useLocale<T extends i18nContents, K extends keyof T>(i18n: T) {
    const [userLo, setUserLo] = useState('zh-CN');
    useEffect(() => setUserLo(window.navigator.language), []);
    const { setting } = useSetting();
    const lo = setting.locale || userLo;
    function locale(key: K, loc?: string) {
        return (i18n as Record<K, Record<string, string>>)[key][loc || lo];
    }
    function localeType<Type extends string>(key: Type, loc?: string) {
        return (i18n as Record<Type, Record<string, string>>)[key][loc || lo];
    }
    return { lo, locale, localeType, userLo };
}