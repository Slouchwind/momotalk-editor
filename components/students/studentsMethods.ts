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
    const schaleJson: schaleInfo[] = await fetch(`https://schale.gg/data/${localeCodes[locale as Locales]}/students.min.json`).then(r => r.json());
    return { fileJson, schaleJson };
}

export function getStudentInfo({ fileJson, schaleJson }: studentsJson, studentId: number): studentInfo {
    const file = fileJson && fileJson.filter(info => (info.id === studentId))[0];
    const schale = schaleJson && schaleJson.filter(info => (info.Id === studentId))[0];
    return { file, schale };
}

export function getAllStudentsList({ schaleJson }: studentsJson): number[] {
    if (!schaleJson) return [];
    return schaleJson.map(v => v.Id).sort();
}

export function getStuSenText(
    id: number | 'sensei',
    stuText: string,
    senText: string,
) {
    return typeof id === 'number' ? stuText : senText;
}