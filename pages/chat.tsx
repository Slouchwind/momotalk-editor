//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student from '@/components/student';

//Styles
import ItemStyles from '@/styles/Item.module.scss';
import ChatStyles from '@/styles/Chat.module.scss';

//Methods
import { useState, useEffect, useRef } from 'react';
import getTitle from '@/components/title';
import { studentsJson } from '@/components/students/students';
import { getStudentInfo, getStudentsJson } from '@/components/students/infoStudents';
import Window, { AllWindow, getWindowFun } from '@/components/window';
import Repeat from '@/components/repeat';
import { AllWindows } from '@/components/window';
import { useClassState } from '@/components/extraReact';

interface ContentProps {
    id: number,
    allInfo: studentsJson,
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

interface State {
    student?: number,
    studentsList?: number[],
    studentsJson?: {
        data: studentsJson,
    }
}

interface IdPromptArg {
    studentsList?: number[];
    type?: '+' | '-';
}

interface TextAlertArg {
    title: string;
    elem: React.ReactNode;
    fun?: () => any;
}

export default function Info() {
    const [state, setState] = useClassState(useState<State>({
        student: 0,
        studentsList: [10000, 10002],
        studentsJson: { data: {} },
    }));

    useEffect(() => {
        getStudentsJson().then(r => setState({ studentsJson: { data: r } }));
    }, []);

    //Window
    const {
        allWindow,
        addNewWindow,
        openWindow,
        closeWindow,
    } = getWindowFun(useState<AllWindow>({ all: [], component: {} }));

    //IdPrompt
    const idPromptInputRef = useRef(0);
    const IdPrompt = new Window<IdPromptArg>('IdPrompt');

    //Alert
    const TextAlert = new Window<TextAlertArg>('TextAlert');

    useEffect(() => {
        const IdPromptTypeText = { '+': '添加', '-': '去除' };
        addNewWindow(IdPrompt, (zIndex, id, display, { studentsList, type }, all) => (
            <IdPrompt.Component
                title='输入Id'
                closeWindow={() => closeWindow(all, id)}
                element={close => (<>
                    <p>请输入需要在列表{IdPromptTypeText[type || '+']}的学生的Id</p>
                    <input type='number' onChange={e => { idPromptInputRef.current = Number(e.target.value); }} />
                    <button
                        children={IdPromptTypeText[type || '+']}
                        onClick={() => {
                            if (type === '+') {
                                if (studentsList?.includes(idPromptInputRef.current)) {
                                    openWindow(all, TextAlert, { title: '错误', elem: '已有此学生' });
                                }
                                else {
                                    setState({ studentsList: studentsList?.concat(idPromptInputRef.current) });
                                    close();
                                }
                            }
                            else if (type === '-') {
                                if (!studentsList?.includes(idPromptInputRef.current)) {
                                    openWindow(all, TextAlert, { title: '错误', elem: '列表中无此学生' });
                                }
                                else {
                                    const i = studentsList.indexOf(idPromptInputRef.current);
                                    studentsList.splice(i, 1);
                                    setState({ studentsList });
                                    close();
                                }
                            }
                        }}
                    />
                </>)}
                zIndex={zIndex}
                display={display}
            />
        ));
        addNewWindow(TextAlert, (zIndex, id, display, { title, elem, fun }, all) => (
            <TextAlert.Component
                title={title}
                closeWindow={() => {
                    if (fun) fun();
                    closeWindow(all, id);
                }}
                element={() => elem}
                zIndex={zIndex}
                display={display}
            />
        ));
    }, []);

    return (
        <MainNode>
            <NextSeo
                title={getTitle('聊天编辑')}
            />
            <AllWindows zIndex={999} allWindow={allWindow} />
            <div id={ItemStyles.infoBar}>
                <div id={ChatStyles.title}>
                    <p id={ChatStyles.left}>学生({state.studentsList?.length})</p>
                    <div id={ChatStyles.right}>
                        <p onClick={_ => {
                            openWindow(allWindow.all, IdPrompt, {
                                studentsList: state.studentsList,
                                type: '+'
                            });
                        }}>+</p>
                        <p onClick={_ => {
                            openWindow(allWindow.all, IdPrompt, {
                                studentsList: state.studentsList,
                                type: '-'
                            });
                        }}>-</p>
                    </div>
                </div>
                <div style={{ height: 70 }} />
                <div id={ItemStyles.all}>
                    <img src='/api/icon/line?fill=63adc6' />
                    <p>所有学生</p>
                </div>
                <div id={ItemStyles.students}>
                    {state.studentsJson && state.studentsList &&
                        <Repeat
                            variable={0}
                            repeat={state.studentsList?.length}
                            func={v => v + 1}
                            components={v => {
                                if (!state.studentsList || !state.studentsJson) return;
                                const id = state.studentsList[v];
                                return (
                                    <Student
                                        id={id}
                                        allInfo={state.studentsJson.data}
                                        key={id}
                                        onClick={() => setState({ student: id })}
                                        select={state.student === id}
                                        onError={id => {
                                            if (state.studentsJson?.data.schaleJson === undefined) return;
                                            openWindow(allWindow.all, TextAlert, {
                                                title: '错误',
                                                elem: `${id}的学生Id不存在`,
                                                fun() {
                                                    openWindow(allWindow.all, IdPrompt, {
                                                        studentsList: state.studentsList,
                                                        type: '+'
                                                    });
                                                },
                                            });
                                            const { studentsList } = state;
                                            studentsList?.splice(studentsList?.indexOf(id), 1);
                                            setState({ studentsList });
                                        }}
                                    />
                                );
                            }}
                        />
                    }
                </div>
            </div>
            <div id={ItemStyles.contentBar}>
                {state.student !== 0 ?
                    state.student && state.studentsJson &&
                    (<Content id={state.student} allInfo={state.studentsJson.data} />)
                    : <p>请选择学生。</p>
                }
            </div>
        </MainNode>
    );
}
