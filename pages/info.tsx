//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student, { AllStudentsIcon } from '@/components/students';

//Styles
import styles from '@/styles/Info.module.scss';

//i18n
import { useLocale } from '@/components/i18n';
import info from '@/components/i18n/config/info';

//Methods
import { useEffect, useState } from 'react';
import getTitle from '@/components/title';
import { studentsJson } from '@/components/students/students';
import { getAllStudentsList, getStudentInfo, getStudentsJson } from '@/components/students/studentsMethods';
import Repeat from '@/components/repeat';
import { getClassState } from '@/components/extraReact';

interface ContentProps {
    id: number,
    allInfo: studentsJson
}

function Content({ id, allInfo }: ContentProps) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div id={styles.content}>
            <div className={styles.img}>
                <img
                    className={styles.col}
                    src={`https://schale.gg/images/student/collection/${info.schale?.CollectionTexture}.webp`}
                    alt={`${info.schale?.Name} collection image`}
                />
            </div>
            <div className={styles.p}>
                <p className={styles.name}>{info.schale?.Name}</p>
                <p className={styles.info}>{info.file?.info}</p>
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
}

export default function Info() {
    const { lo, locale } = useLocale(info);
    const [state, setState] = getClassState(useState<State>({
        student: 0,
        studentsJson: { data: {} }
    }));

    const [allStuList, setAllStuList] = useState<number[]>([]);

    useEffect(() => {
        getStudentsJson(lo).then(r => {
            setAllStuList(getAllStudentsList(r));
            setState({ studentsJson: { data: r } });
        });
    }, [lo]);

    return (
        <MainNode>
            <NextSeo
                title={getTitle(locale('title'))}
            />
            <div id={styles.infoBar}>
                <div id={styles.title}>
                    <p>{locale('student')}({allStuList.length})</p>
                </div>
                <div style={{ height: 70 }} />
                <div id={styles.all}>
                    <AllStudentsIcon />
                    <p>{locale('allStudents')}</p>
                </div>
                <div id='students'>
                    {state.studentsJson && (
                        <Repeat
                            variable={0}
                            repeat={allStuList.length}
                            func={i => i + 1}
                            components={i => {
                                const v = allStuList[i];
                                return (
                                    <Student
                                        id={v}
                                        allInfo={state.studentsJson.data}
                                        key={v}
                                        onClick={_ => setState({ student: v })}
                                        select={state.student === v}
                                    />
                                );
                            }}
                        />
                    )}
                </div>
            </div>
            <div id={styles.contentBar}>
                {state.student !== 0 ?
                    <Content id={state.student} allInfo={state.studentsJson.data} />
                    :
                    <p>{locale('selectStudents')}</p>
                }
            </div>
        </MainNode>
    );
}
