import { useSetting } from "../setting";

export type Locales = 'zh-CN' | 'zh-TW';

export type i18nContents = Record<string, Record<Locales, string>>;

export function fillBlank(i18n: string, ...fills: (string | undefined)[]): string {
    let text = i18n;
    fills.forEach((v, i) => text = text.replace(`$${i}`, v || ''));
    return text;
}

export function useLocale<T extends i18nContents, K extends keyof T>(i18n: T) {
    const { setting } = useSetting();
    //const { locale: localeText, defaultLocale = 'zh-CN', ...other } = useRouter();
    const lo = setting.locale || 'zh-CN';
    function locale(key: K, loc?: string) {
        return (i18n as Record<K, Record<string, string>>)[key][loc || lo];
    }
    function localeType<Type extends string>(key: Type, loc?: string) {
        return (i18n as Record<Type, Record<string, string>>)[key][loc || lo];
    }
    return { lo, locale, localeType };
}