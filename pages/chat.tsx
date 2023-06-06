//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student, { AllStudentsIcon } from '@/components/student';

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
import { getClassState } from '@/components/extraReact';
import ImgCol from '@/components/imgCol';
import { downloadFile, uploadFile } from '@/components/loadFile';

interface MessageProps {
    id: number | 'sensei';
    msg: React.ReactNode;
    allInfo: studentsJson;
}

function Message({ id, msg, allInfo }: MessageProps) {
    if (id === 'sensei') {
        return (
            <div className={ChatStyles.sensei}>
                <div id={ChatStyles.triangle} />
                <div id={ChatStyles.text}>{msg}</div>
            </div>
        );
    }
    else {
        const info = getStudentInfo(allInfo, id);
        return (
            <div className={ChatStyles.message}>
                <ImgCol
                    style={{
                        margin: 10
                    }}
                    size={60}
                    info={info}
                />
                <div id={ChatStyles.right}>
                    <p>{info.schale?.Name}</p>
                    <div>
                        <div id={ChatStyles.triangle} />
                        <div id={ChatStyles.text}>{msg}</div>
                    </div>
                </div>
            </div>
        );
    }
}

interface MessageData {
    type: 'text' | 'img';
    id: number | 'sensei';
    msg: string;
}

interface MessagesGroupProps {
    data: MessageData[];
    allInfo: studentsJson;
}

function MessagesGroup({ data, allInfo }: MessagesGroupProps) {
    return (<>
        {data.map((v, i) => {
            if (v.type === 'text')
                return (
                    <Message
                        id={v.id}
                        msg={v.msg.split('\n').map((value, index) => (<p key={index}>{value}</p>))}
                        allInfo={allInfo}
                        key={i}
                    />
                );
        })}
    </>);
}

interface LoaderState {
    type: 'up' | 'down';
    chatState: ChatState;
    setChatState: (newState: Partial<ChatState>) => void;
}

function Loader({ type, chatState, setChatState }: LoaderState) {
    return (
        <img
            src={`/api/icon/${type}load?fill=000`}
            alt={`${type}load icon`}
            title={{
                'up': '上传',
                'down': '下载'
            }[type] + 'JSON文件'}
            onClick={() => {
                if (type === 'up') uploadFile(e => {
                    const result = e.target?.result;
                    if (typeof result !== 'string') return;
                    const json = JSON.parse(result);
                    setChatState({ studentsChat: json });
                });
                if (type === 'down') downloadFile(chatState.studentsChat || {}, 'untitled.json');
            }}
        />
    )
}

function ChatEditorBar({ chatState, setChatState }: {
    chatState: ChatState;
    setChatState: (newState: Partial<ChatState>) => void;
}) {
    return (
        <div id={ChatStyles.editor}>
            <Loader
                type='up'
                chatState={chatState}
                setChatState={setChatState}
            />
            <Loader
                type='down'
                chatState={chatState}
                setChatState={setChatState}
            />
        </div>
    );
}

interface ContentProps {
    id: number;
    chatState: ChatState;
    setChatState: (newState: Partial<ChatState>) => void;
    allInfo: studentsJson;
}

function Content({ id, chatState, setChatState, allInfo }: ContentProps) {
    return (
        <div id={ItemStyles.content}>
            <MessagesGroup
                data={chatState.studentsChat?.[String(id)] || []}
                allInfo={allInfo}
            />
            <ChatEditorBar
                chatState={chatState}
                setChatState={setChatState}
            />
        </div>
    );
}

interface ListState {
    student?: number;
    studentsList?: number[];
    studentsJson?: {
        data: studentsJson;
    };
}

interface ChatState {
    studentsChat?: { [x: string]: MessageData[] };
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
    const [listState, setListState] = getClassState(useState<ListState>({
        student: 0,
        studentsList: [10000, 10002],
        studentsJson: { data: {} },
    }));
    const [chatState, setChatState] = getClassState(useState<ChatState>({
        studentsChat: {
            "10000": [
                { type: 'text', id: 10000, msg: '这是什么？' },
                { type: 'text', id: 10000, msg: '00000000000000000000000000000000000000000000000000000000000' },
                { type: 'text', id: 'sensei', msg: '这是什么？' },
            ],
            "10045": [
                { type: 'text', id: 10045, msg: '好热啊~\n一动不动还是好热啊~' },
            ]
        }
    }));

    useEffect(() => {
        let list: string = window?.localStorage.studentsList;
        if (list !== undefined) {
            setListState({ studentsList: list.split(',').map(v => Number(v)) });
        }
        let chat: string = window?.localStorage.studentsChat;
        if (chat !== undefined) {
            setChatState({ studentsChat: JSON.parse(chat) });
        }
    }, [])

    useEffect(() => {
        getStudentsJson().then(r => setListState({ studentsJson: { data: r } }));
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
                        onClick={() => {
                            if (type === '+') {
                                if (studentsList?.includes(idPromptInputRef.current)) {
                                    openWindow(all, TextAlert, { title: '错误', elem: '已有此学生' });
                                }
                                else {
                                    studentsList = studentsList?.concat(idPromptInputRef.current);
                                    window.localStorage.studentsList = studentsList?.join();
                                    setListState({ studentsList });
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
                                    window.localStorage.studentsList = studentsList?.join();
                                    setListState({ studentsList });
                                    close();
                                }
                            }
                        }}
                    >{IdPromptTypeText[type || '+']}</button>
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

    useEffect(() => {
        listState.studentsList?.forEach(id => {
            if (listState.studentsJson?.data.schaleJson === undefined) return;
            if (getStudentInfo(listState.studentsJson.data, id).schale?.CollectionTexture !== undefined) return;
            openWindow(allWindow.all, TextAlert, {
                title: '错误',
                elem: `${id}的学生Id不存在`,
                fun() {
                    openWindow(allWindow.all, IdPrompt, {
                        studentsList: listState.studentsList,
                        type: '+'
                    });
                },
            });
            const { studentsList } = listState;
            studentsList?.splice(studentsList?.indexOf(id), 1);
            setListState({ studentsList });
        });
    }, [listState.studentsList]);

    return (
        <MainNode>
            <NextSeo
                title={getTitle('聊天编辑')}
            />
            <AllWindows zIndex={999} allWindow={allWindow} />
            <div id={ItemStyles.infoBar}>
                <div id={ChatStyles.title}>
                    <p id={ChatStyles.left}>学生({listState.studentsList?.length})</p>
                    <div id={ChatStyles.right}>
                        <p onClick={_ => {
                            openWindow(allWindow.all, IdPrompt, {
                                studentsList: listState.studentsList,
                                type: '+'
                            });
                        }}>+</p>
                        <p onClick={_ => {
                            openWindow(allWindow.all, IdPrompt, {
                                studentsList: listState.studentsList,
                                type: '-'
                            });
                        }}>-</p>
                    </div>
                </div>
                <div style={{ height: 70 }} />
                <div id={ItemStyles.all}>
                    <AllStudentsIcon />
                    <p>所有学生</p>
                </div>
                <div id={ItemStyles.students}>
                    {listState.studentsJson && listState.studentsList &&
                        <Repeat
                            variable={0}
                            repeat={listState.studentsList?.length}
                            func={v => v + 1}
                            components={v => {
                                if (!listState.studentsJson || !listState.studentsList) return;
                                const id = listState.studentsList[v];
                                return (
                                    <Student
                                        id={id}
                                        allInfo={listState.studentsJson.data}
                                        key={id}
                                        onClick={() => setListState({ student: id })}
                                        select={listState.student === id}
                                    />
                                );
                            }}
                        />
                    }
                </div>
            </div>
            <div id={ItemStyles.contentBar}>
                {listState.student !== 0 ?
                    listState.student && listState.studentsJson &&
                    <Content
                        id={listState.student}
                        chatState={chatState}
                        setChatState={setChatState}
                        allInfo={listState.studentsJson.data}
                    />
                    :
                    <p>请选择学生。</p>
                }
            </div>
        </MainNode>
    );
}
