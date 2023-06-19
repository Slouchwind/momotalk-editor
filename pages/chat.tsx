//Components
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import MainNode from '@/components/main';
import Student, { AllStudentsIcon } from '@/components/students/student';
import Repeat from '@/components/repeat';
import ImgCol from '@/components/imgCol';

//Styles
import styles from '@/styles/Chat.module.scss';

//Methods
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import getTitle from '@/components/title';
import { studentsJson } from '@/components/students/students';
import { getStudentInfo, getStudentsJson, getStuSenText } from '@/components/students/studentsMethods';
import Window, { AllWindows, AllWindow, getWindowFun } from '@/components/window';
import { setStateFun, getClassState } from '@/components/extraReact';
import { downloadFile, uploadFile } from '@/components/loadFile';
import { chat, fillBlank, i18nContents } from '@/components/i18n';

const StatesContext = createContext<{
    allWindow: AllWindow;
    listState: ListState;
    chatState: ChatState;
    setChatState: setStateFun<ChatState>;
}>({
    allWindow: {},
    listState: {},
    chatState: {},
    setChatState: () => { },
});

const SendMessageFunContext = createContext<(
    id: MessageData['id'],
    type?: MessageData['type'],
) => void>(() => { });

const loContext = createContext<string>('zh-CN');

interface MsgProps {
    msg: MessageProps['msg'];
    type: MessageData['type'];
}

function Msg({ msg, type }: MsgProps) {
    if (type === 'text') return (<>
        <div id={styles.triangle} />
        <div id={styles.text}>{msg}</div>
    </>);
    else if (type === 'img') return (<div id={styles.img}>{msg}</div>);
    else return (<></>);
}

interface MessageProps {
    id: MessageData['id'];
    msg: React.ReactNode;
    type: MessageData['type'];
}

function Message({ id, msg, type }: MessageProps) {
    const { listState } = useContext(StatesContext);
    const allInfo = listState.studentsJson?.data || {};
    if (id === 'sensei') {
        return (
            <div
                className={styles.sensei}
                onContextMenu={e => {
                    e.preventDefault();
                }}
            ><Msg msg={msg} type={type} /></div>
        );
    }
    else {
        const info = getStudentInfo(allInfo, id);
        return (
            <div className={styles.message}>
                <ImgCol
                    style={{
                        margin: 10
                    }}
                    size={60}
                    info={info}
                />
                <div id={styles.right}>
                    <p>{info.schale?.Name}</p>
                    <div
                        onContextMenu={e => {
                            e.preventDefault();
                        }}
                    ><Msg msg={msg} type={type} /></div>
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

function MessagesGroup() {
    const { listState, chatState } = useContext(StatesContext);
    const data = chatState.studentsChat?.[String(listState.student)] || [];
    return (<>
        {data.map((v, i) => {
            if (v.type === 'text') return (
                <Message
                    id={v.id}
                    msg={v.msg.split('\n').map((value, index) => (<p key={index}>{value}</p>))}
                    type={v.type}
                    key={i}
                />
            );
            else if (v.type === 'img') return (
                <Message
                    id={v.id}
                    msg={<img src={v.msg} />}
                    type={v.type}
                    key={i}
                />
            );
        })}
    </>);
}

interface SenderState {
    id: MessageData['id'];
}

function Sender({ id }: SenderState) {
    const sendMessageFun = useContext(SendMessageFunContext);
    const lo = useContext(loContext);
    return (
        <img
            src={`/api/icon/chat?fill=${getStuSenText(id, '4c5a6e', '4a89ca')}`}
            alt={`${id} send icon`}
            title={getStuSenText(id, chat.sendMsgStudent[lo], chat.sendMsgSensei[lo])}
            onClick={() => sendMessageFun(id)}
            onContextMenu={e => {
                e.preventDefault();
                sendMessageFun(id, 'img');
            }}
        />
    );
}

interface LoaderState {
    type: 'up' | 'down';
}

function Loader({ type }: LoaderState) {
    const { chatState, setChatState } = useContext(StatesContext);
    const lo = useContext(loContext);
    return (
        <img
            src={`/api/icon/${type}load?fill=000`}
            alt={`${type}load icon`}
            title={chat[type][lo] + chat.jsonFile[lo]}
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

function ChatEditorBar() {
    const { listState } = useContext(StatesContext);
    return (
        <div id={styles.editor}>
            <Sender id={listState.student || 10000} />
            <Sender id='sensei' />
            <Loader type='up' />
            <Loader type='down' />
        </div>
    );
}

function Content() {
    const { listState } = useContext(StatesContext);
    const lo = useContext(loContext);
    if (!listState.studentsJson) return null;
    if (listState.student === 0) return (<p>{chat.selectStudents[lo]}</p>);
    return (
        <div id={styles.content}>
            <MessagesGroup />
            <ChatEditorBar />
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
    studentsList?: ListState['studentsList'];
    type?: '+' | '-';
}

interface TextAlertArg {
    title: string;
    elem: React.ReactNode;
    fun?: () => any;
}

interface SendMessageArg {
    studentsJson?: ListState['studentsJson'];
    selId?: ListState['student'];
    studentsChat?: ChatState['studentsChat'];
    id: MessageData['id'];
    type: MessageData['type'];
}

export default function Info() {
    const { locale, defaultLocale = 'zh-CN' } = useRouter();
    const lo = locale || defaultLocale;
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
    }, []);

    useEffect(() => {
        getStudentsJson(locale || defaultLocale).then(r => setListState({ studentsJson: { data: r } }));
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

    //Message
    const sendMessageInputRef = useRef('');
    const SendMessage = new Window<SendMessageArg>('SendMessage');

    useEffect(() => {
        addNewWindow(IdPrompt, (zIndex, id, display, { studentsList, type }, all) => (
            <IdPrompt.Component
                title={chat.idPromptTitle[lo]}
                closeWindow={() => closeWindow(all, id)}
                element={close => (<>
                    <p>{fillBlank(chat.idPromptInfo[lo], chat[type || '+'][lo])}</p>
                    <input type='number' onChange={e => { idPromptInputRef.current = Number(e.target.value); }} />
                    <button
                        onClick={() => {
                            if (type === '+') {
                                if (studentsList?.includes(idPromptInputRef.current)) {
                                    openWindow(all, TextAlert, { title: chat.error[lo], elem: chat.sameStudent[lo] });
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
                                    openWindow(all, TextAlert, { title: chat.error[lo], elem: chat.withoutStudent[lo] });
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
                    >{chat[type || '+'][lo]}</button>
                </>)}
                zIndex={zIndex}
                display={display}
            />
        ));
        addNewWindow(TextAlert, (zIndex, id, display, { title, elem, fun }, all) => (
            <TextAlert.Component
                title={title}
                closeWindow={() => {
                    fun?.();
                    closeWindow(all, id);
                }}
                element={() => elem}
                zIndex={zIndex}
                display={display}
            />
        ));
        addNewWindow(SendMessage, (zIndex, winId, display, { studentsJson, selId, studentsChat, id, type }, all) => (
            <SendMessage.Component
                title={getStuSenText(id, chat.sendMsgStudent[lo], chat.sendMsgSensei[lo])}
                closeWindow={() => closeWindow(all, winId)}
                element={close => {
                    sendMessageInputRef.current = '';
                    return (<>
                        <p>
                            {fillBlank(
                                chat.sendMsgInfo[lo],
                                getStuSenText(
                                    id,
                                    chat.sendMsgStudentInfo[lo],
                                    chat.sendMsgSenseiInfo[lo]
                                ),
                                getStudentInfo(
                                    studentsJson?.data || {},
                                    selId || 10000
                                ).schale?.Name,
                                chat[type][lo]
                            )}
                        </p>
                        {type === 'text' && <textarea onChange={e => sendMessageInputRef.current = e.target.value} />}
                        {type === 'img' && <input onChange={e => sendMessageInputRef.current = e.target.value} />}
                        <button
                            onClick={() => {
                                if (!studentsChat) return;
                                if (sendMessageInputRef.current.trim() === '') return;
                                let messageData = studentsChat[String(selId)];
                                let newData: MessageData = { type, id, msg: sendMessageInputRef.current };
                                studentsChat[String(selId)] = messageData ? messageData.concat(newData) : [newData];
                                setChatState({ studentsChat: studentsChat });
                                close();
                            }}
                        >{chat.sendMsg[lo]}</button>
                    </>);
                }}
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
                title: chat.error[lo],
                elem: fillBlank(chat.undefinedStudent[lo], String(id)),
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
                title={getTitle(chat.title[lo])}
            />
            <AllWindows zIndex={999} allWindow={allWindow} />
            <div id={styles.infoBar}>
                <div id={styles.title}>
                    <p id={styles.left}>{chat.student[lo]}({listState.studentsList?.length})</p>
                    <div id={styles.right}>
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
                <div id={styles.all}>
                    <AllStudentsIcon />
                    <p>{chat.allStudents[lo]}</p>
                </div>
                <div id='students'>
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
            <div id={styles.contentBar} style={listState.student === 0 ? { 'alignItems': 'center' } : {}}>
                <StatesContext.Provider value={{
                    allWindow,
                    listState,
                    chatState,
                    setChatState,
                }}>
                    <SendMessageFunContext.Provider value={(id, type = 'text') => {
                        openWindow(allWindow.all, SendMessage, {
                            studentsJson: listState.studentsJson,
                            selId: listState.student,
                            studentsChat: chatState.studentsChat,
                            id,
                            type,
                        });
                    }}>
                        <loContext.Provider value={lo}>
                            <Content />
                        </loContext.Provider>
                    </SendMessageFunContext.Provider>
                </StatesContext.Provider>
            </div>
        </MainNode>
    );
}
