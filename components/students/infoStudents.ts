import { fileInfo, schaleInfo, studentsJson, studentInfo } from './students';

export async function getStudentsJson(): Promise<studentsJson> {
    const fileJson: fileInfo[] = await fetch('../students.json').then(r => r.json());
    const schaleJson: schaleInfo[] = await fetch('https://schale.gg/data/cn/students.min.json?v=102').then(r => r.json());
    return { fileJson, schaleJson };
}

export function getStudentInfo({ fileJson, schaleJson }: studentsJson, studentId: number): studentInfo {
    const file = fileJson && fileJson.filter(info => (info.id === studentId))[0];
    const schale = schaleJson && schaleJson.filter(info => (info.Id === studentId))[0];
    return { file, schale };
}