//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student, { AllStudentsIcon } from '@/components/student';

//Styles
import styles from '@/styles/Info.module.scss';

//Methods
import { useEffect, useState } from 'react';
import getTitle from '@/components/title';
import { studentsJson } from '@/components/students/students';
import { getStudentInfo, getStudentsJson } from '@/components/students/infoStudents';
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
    const [state, setState] = getClassState(useState<State>({
        student: 0,
        studentsJson: { data: {} }
    }));
    useEffect(() => {
        getStudentsJson().then(r => setState({ studentsJson: { data: r } }));
    }, []);
    return (
        <MainNode>
            <NextSeo
                title={getTitle('学生信息')}
            />
            <div id={styles.infoBar}>
                <div id={styles.title}>
                    <p>学生(123)</p>
                </div>
                <div style={{ height: 70 }} />
                <div id={styles.all}>
                    <AllStudentsIcon />
                    <p>所有学生</p>
                </div>
                <div id='students'>
                    {state.studentsJson &&
                        <Repeat
                            variable={0}
                            repeat={5}
                            func={v => v + 1}
                            components={v => {
                                const { num, i } = [
                                    { num: 10000, i: 63 },
                                    { num: 13000, i: 13 },
                                    { num: 16000, i: 13 },
                                    { num: 20000, i: 25 },
                                    { num: 26000, i: 9 },
                                ][v];
                                return (
                                    <Repeat
                                        variable={num}
                                        repeat={i}
                                        func={v => v + 1}
                                        components={v => (
                                            <Student
                                                id={v}
                                                allInfo={state.studentsJson.data}
                                                key={v}
                                                onClick={_ => setState({ student: v, })}
                                                select={state.student === v}
                                            />
                                        )}
                                        key={v}
                                    />
                                );
                            }}
                        />
                    }
                </div>
            </div>
            <div id={styles.contentBar}>
                {state.student !== 0 ?
                    <Content id={state.student} allInfo={state.studentsJson.data} />
                    :
                    <p>请选择学生。</p>
                }
            </div>
        </MainNode>
    );
}
