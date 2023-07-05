import Repeat from "./repeat";
import { AllStudentsIcon } from "./students";

interface InfoBarProps {
    styles: Record<string, string>;
    locale: (key: 'student' | 'allStudents') => string;
    studentsList: number[];
    right?: React.ReactNode;
    students: (id: number) => React.ReactNode;
}

export default function InfoBar({ styles, locale, studentsList, right, students }: InfoBarProps) {
    return (
        <div id={styles.infoBar}>
            <div id={styles.title}>
                <p id={styles.left}>{locale('student')}({studentsList.length})</p>
                {right && (
                    <div id={styles.right}>
                        {right}
                    </div>
                )}
            </div>
            <div style={{ height: 70 }} />
            <div id={styles.all}>
                <AllStudentsIcon />
                <p>{locale('allStudents')}</p>
            </div>
            <div id='students'>{
                <Repeat
                    variable={0}
                    repeat={studentsList.length}
                    func={i => i + 1}
                    components={i => students(studentsList[i])}
                />
            }</div>
        </div>
    );
}