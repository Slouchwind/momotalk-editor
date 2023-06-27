import { fileInfo, schaleInfo, studentsJson, studentInfo } from './students';

export async function getStudentsJson(locale: string): Promise<studentsJson> {
    const fileJson: fileInfo[] = await fetch('../students.json').then(r => r.json());
    const schaleJson: schaleInfo[] = await fetch(`https://schale.gg/data/${locale.slice(3).toLowerCase()}/students.min.json`).then(r => r.json());
    return { fileJson, schaleJson };
}

export function getStudentInfo({ fileJson, schaleJson }: studentsJson, studentId: number): studentInfo {
    const file = fileJson && fileJson.filter(info => (info.id === studentId))[0];
    const schale = schaleJson && schaleJson.filter(info => (info.Id === studentId))[0];
    return { file, schale };
}

export function getStuSenText(
    id: number | 'sensei',
    stuText: string,
    senText: string,
) {
    return typeof id === 'number' ? stuText : senText;
}