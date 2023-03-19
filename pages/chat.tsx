//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';

//Styles
import ItemStyles from '@/styles/Item.module.scss';
import ChatStyles from '@/styles/Chat.module.scss';

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
        <div onClick={onClick} style={{ backgroundColor: select ? '#dce5ec' : '#f3f7f8' }} title={`id:${id}`}>
            <div className={ItemStyles.img}>
                <img
                    className={ItemStyles.col}
                    src={`https://schale.gg/images/student/collection/${info.schale?.CollectionTexture}.webp`}
                    alt={`${info.schale?.Name} collection image`}
                />
            </div>
            <div className={ItemStyles.p}>
                <p className={ItemStyles.name}>{info.schale?.Name}</p>
                <p className={ItemStyles.info}>{info.file?.info}</p>
            </div>
            <div className={ItemStyles.line} />
        </div>
    );
}

function Content({ id, allInfo }: ContentProps) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div id={ItemStyles.content}>
            <div className={ItemStyles.img}>
                <img
                    className={ItemStyles.col}
                    src={`https://schale.gg/images/student/collection/${info.schale?.CollectionTexture}.webp`}
                    alt={`${info.schale?.Name} collection image`}
                />
            </div>
            <div className={ItemStyles.p}>
                <p className={ItemStyles.name}>{info.schale?.Name}</p>
                <p className={ItemStyles.info}>{info.file?.info}</p>
            </div>
            <div className={ItemStyles.birthday}>
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
        studentsList: number[],
        studentsJson: {
            data: studentsJson,
            fetch: boolean,
        }
    }>({
        student: 0,
        studentsList: [10000, 10002],
        studentsJson: { data: {}, fetch: false },
    });
    if (!state.studentsJson.fetch) getStudentsJson().then(r => setState({
        student: state.student,
        studentsList: state.studentsList,
        studentsJson: { data: r, fetch: true },
    }));
    return (
        <MainNode>
            <NextSeo
                title={getTitle('聊天编辑')}
            />
            <div id={ItemStyles.infoBar}>
                <div id={ChatStyles.title}>
                    <p id={ChatStyles.left}>学生({state.studentsList.length})</p>
                    <p id={ChatStyles.right} onClick={_ => {
                        const id = Number(window.prompt('Input id', '10001')) || 10001;
                        let { studentsList } = state;
                        studentsList.push(id);
                        setState({
                            student: state.student,
                            studentsList: studentsList,
                            studentsJson: state.studentsJson,
                        })
                    }}>+</p>
                </div>
                <div style={{ height: 70 }} />
                <div id={ItemStyles.all}>
                    <img src='/api/icon/line?fill=63adc6' />
                    <p>所有学生</p>
                </div>
                <div id={ItemStyles.students}>
                    {state.studentsJson.fetch &&
                        <Repeat
                            variable={0}
                            repeat={state.studentsList.length}
                            func={v => v + 1}
                            components={v => {
                                const id = state.studentsList[v];
                                return (
                                    <Student
                                        id={id}
                                        allInfo={state.studentsJson.data}
                                        key={id}
                                        onClick={_ => setState({
                                            student: id,
                                            studentsList: state.studentsList,
                                            studentsJson: state.studentsJson,
                                        })}
                                        select={state.student === id}
                                    />
                                );
                            }}
                        />
                    }
                </div>
            </div>
            <div id={ItemStyles.contentBar}>
                {state.student !== 0 ?
                    <Content id={state.student} allInfo={state.studentsJson.data} />
                    :
                    <p>请选择学生。</p>
                }
            </div>
        </MainNode>
    );
}
