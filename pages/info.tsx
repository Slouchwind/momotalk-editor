//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student from '@/components/students';

//Types
import type { blueArcBoxInfo, studentsJson } from '@/components/students/students';

//Styles
import styles from '@/styles/Info.module.scss';

//i18n
import { useLocale } from '@/components/i18n';
import info from '@/components/i18n/config/info';

//Methods
import { useEffect, useState } from 'react';
import getTitle from '@/components/title';
import { getAllStudentsList, getBioInfo, getBlueArcBoxJson, getStudentInfo, getStudentsJson } from '@/components/students/studentsMethods';
import { useClassState } from '@/components/extraReact';
import InfoBar from '@/components/infoBar';

interface ContentProps {
    id: number;
    allInfo: studentsJson;
    bioText: string;
    lo: string;
}

function Content({ id, allInfo, bioText, lo }: ContentProps) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div id={styles.content}>
            <div className={styles.img}>
                <img
                    className={styles.col}
                    src={`https://schale.gg/images/student/collection/${id}.webp`}
                    alt={`${id} collection image`}
                />
            </div>
            <div className={styles.p}>
                <p className={styles.name}>{info.schale?.Name}</p>
                <p className={styles.info}>{bioText}</p>
            </div>
            <div className={styles.birthday}>
                <img
                    src='/api/icon/birth?fill=5f7c8c'
                    alt={`${info.schale?.Name} birthday icon`}
                />
                <p>{info.schale?.Birthday}</p>
            </div>
        </div>
    );
}

interface State {
    student: number;
    studentsJson: {
        data: studentsJson;
    };
    blueArcBoxJson: blueArcBoxInfo[];
}

export default function Info() {
    const { lo, locale } = useLocale(info);
    const [state, setState] = useClassState<State>({
        student: 0,
        studentsJson: { data: {} },
        blueArcBoxJson: [],
    });

    const [allStuList, setAllStuList] = useState<number[]>([]);

    useEffect(() => {
        getStudentsJson(lo).then(r => {
            setAllStuList(getAllStudentsList(r));
            setState({ studentsJson: { data: r } });
        });
        getBlueArcBoxJson().then(r => {
            setState({ blueArcBoxJson: r });
        });
    }, [lo]);

    return (
        <MainNode>
            <NextSeo
                title={getTitle(locale('title'))}
            />
            <InfoBar
                styles={styles}
                locale={locale}
                studentsList={allStuList}
                students={id => (
                    <Student
                        id={id}
                        allInfo={state.studentsJson.data}
                        blueArcBoxJson={state.blueArcBoxJson}
                        key={id}
                        onClick={_ => setState({ student: id })}
                        select={state.student === id}
                        lo={lo}
                    />
                )}
            />
            <div id={styles.contentBar}>
                {state.student !== 0 ?
                    <Content
                        id={state.student}
                        allInfo={state.studentsJson.data}
                        bioText={getBioInfo(state.blueArcBoxJson, state.student, lo)}
                        lo={lo}
                    />
                    : <p>{locale('selectStudents')}</p>}
            </div>
        </MainNode>
    );
}
