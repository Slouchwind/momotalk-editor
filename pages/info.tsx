//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';

//Styles
import styles from '@/styles/Item.module.scss';

//Methods
import { useState } from 'react';
import getTitle from '@/components/title';
import { studentsJson } from '@/components/students/students';
import { getStudentInfo, getStudentsJson } from '@/components/students/infoStudents';

interface RepeatProps<T> {
    variable: T,
    repeat: number,
    func: (variable: T) => T,
    components: (variable: T) => JSX.Element,
}

interface StudentProps {
    id: number,
    allInfo: studentsJson,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    select: boolean,
}

interface ContentProps {
    id: number,
    allInfo: studentsJson
}

function Repeat<T>({ variable, repeat, func, components }: RepeatProps<T>) {
    const array = new Array(repeat).fill(null);
    array.forEach((_, i) => {
        array[i] = components(variable);
        variable = func(variable);
    });
    return <>{array}</>;
}

function Student({ id, allInfo, onClick, select }: StudentProps) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div onClick={onClick} style={{ backgroundColor: select ? '#dce5ec' : '#f3f7f8' }}>
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
            <div className={styles.line} />
        </div>
    );
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

export default function Info() {
    const [state, setState] = useState<{
        student: number,
        studentsJson: {
            data: studentsJson,
            fetch: boolean,
        }
    }>({
        student: 0,
        studentsJson: { data: {}, fetch: false }
    });
    if (!state.studentsJson.fetch) getStudentsJson().then(r => setState({
        student: state.student,
        studentsJson: { data: r, fetch: true }
    }));
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
                    <img src='/api/icon/line?fill=63adc6' />
                    <p>所有学生</p>
                </div>
                <div id={styles.students}>
                    {state.studentsJson.fetch &&
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
                                                onClick={_ => setState({
                                                    student: v,
                                                    studentsJson: state.studentsJson,
                                                })}
                                                select={state.student === v}
                                            />
                                        )}
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
