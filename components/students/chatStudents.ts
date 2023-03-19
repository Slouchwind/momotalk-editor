import { fileInfo, schaleInfo, studentsJson, studentInfo } from './students';

export async function getStudentJson(): Promise<studentsJson> {
    const studentsJson: fileInfo[] = await fetch('../students.json').then(r => r.json());
    const schaleJson: schaleInfo[] = await fetch('https://schale.gg/data/cn/students.min.json?v=102').then(r => r.json());
    return { fileJson: studentsJson, schaleJson };
}

export function getStudentInfo({ fileJson: studentsJson, schaleJson }: studentsJson, studentId: number): studentInfo {
    const json = studentsJson && studentsJson.filter(info => (info.id === studentId))[0];
    const schale = schaleJson && schaleJson.filter(info => (info.Id === studentId))[0];
    return { file: json, schale };
}