import { Locales } from '../i18n';
import { fileInfo, schaleInfo, studentsJson, studentInfo } from './students';

export async function getStudentsJson(locale: string): Promise<studentsJson> {
    if (locale.length < 5) return new Promise(() => { });
    const localeCodes:
        Record<Locales, string> = {
        'zh-CN': 'cn',
        'zh-TW': 'tw',
        'en-US': 'en'
    };
    const fileJson: fileInfo[] = await fetch('../students.json').then(r => r.json());
    const schaleJson: schaleInfo[] = await fetch(`https://schaledb.com/data/${localeCodes[locale as Locales]}/students.min.json`).then(r => r.json());
    return { fileJson, schaleJson };
}

export function getStudentInfo({ fileJson, schaleJson }: studentsJson, studentId: number): studentInfo {
    console.log({ fileJson, schaleJson });
    const file = fileJson?.filter(info => (info.id === studentId))[0];
    const schale = schaleJson?.[studentId];
    return { file, schale };
}

export function getAllStudentsList({ schaleJson }: studentsJson): number[] {
    if (!schaleJson) return [];
    return Object.keys(schaleJson).map(k => Number(k));
}

export function getStuSenText(
    id: number | 'sensei',
    stuText: string,
    senText: string,
) {
    return typeof id === 'number' ? stuText : senText;
}