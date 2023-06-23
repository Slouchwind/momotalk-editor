import { useRouter } from "next/router";

export type i18nContents = { [x: string]: { [x: string]: string } };

export function fillBlank(i18n: string, ...fills: (string | undefined)[]): string {
    let text = i18n;
    fills.forEach((v, i) => text = text.replace(`$${i}`, v || ''));
    return text;
}

export function useLocale<T extends i18nContents, K extends keyof T>(i18n: T) {
    const { locale: localeText, defaultLocale = 'zh-CN', ...other } = useRouter();
    const lo = localeText || defaultLocale;
    function locale(key: K) {
        return i18n[key][lo];
    }
    return { lo, locale, ...other };
}