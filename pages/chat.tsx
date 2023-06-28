//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student, { AllStudentsIcon } from '@/components/students';
import Repeat from '@/components/repeat';
import ImgCol from '@/components/imgCol';
import ContentMenu from '@/components/contentMenu';

//Style
import styles from '@/styles/Chat.module.scss';

//i18n
import { fillBlank, useLocale } from '@/components/i18n';
import chat from '@/components/i18n/config/chat';

//Methods
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import getTitle from '@/components/title';
import { studentsJson } from '@/components/students/students';
import { getStudentInfo, getStudentsJson, getStuSenText } from '@/components/students/studentsMethods';
import Window, { AllWindows, AllWindow, getWindowFun } from '@/components/window';
import { SetStateFun, getClassState } from '@/components/extraReact';
import { downloadFile, uploadFile } from '@/components/loadFile';
import { ContentMenuSet } from '@/components/contentMenu';
import { SettingState, useSetting } from '@/components/setting';

const StatesContext = createContext<{
    allWindow: AllWindow;
    listState: ListState;
    setListState: SetStateFun<ListState>;
    chatState: ChatState;
    setChatState: SetStateFun<ChatState>;
}>({
    allWindow: {},
    listState: {},
    setListState: () => { },
    chatState: {},
    setChatState: () => { },
});

const SendMessageFunContext = createContext<(
    id: MessageData['id'],
    type?: MessageData['type'],
) => void>(() => { });

const localeContext = createContext<(key: keyof typeof chat) => string>((key: keyof typeof chat) => key);

const SetCMMessageFunContext = createContext<(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    i: number
) => void
>(() => { });

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
    i: number;
}

function Message({ id, msg, type, i }: MessageProps) {
    const { listState: { studentsJson } } = useContext(StatesContext);
    const fun = useContext(SetCMMessageFunContext);
    const allInfo = studentsJson?.data || {};

    function contextMenuHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        fun(e, i);
    }

    if (id === 'sensei') {
        return (
            <div
                className={styles.sensei}
                onContextMenu={contextMenuHandler}
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
                        onContextMenu={contextMenuHandler}
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
    const {
        listState: {
            student
        },
        chatState: {
            studentsChat
        },
    } = useContext(StatesContext);
    const data = studentsChat?.[String(student)] || [];
    return (<>
        {data.map((v, i) => (
            <Message
                id={v.id}
                msg={(() => {
                    if (v.type === 'text')
                        return v.msg.split('\n').map((value, index) => (<p key={index}>{value}</p>));
                    else if (v.type === 'img') return (<img src={v.msg} />);
                })()}
                type={v.type}
                i={i}
                key={i}
            />
        ))}
    </>);
}

interface SenderState {
    id: MessageData['id'];
}

function Sender({ id }: SenderState) {
    const sendMessageFun = useContext(SendMessageFunContext);
    const locale = useContext(localeContext);
    return (
        <img
            src={`/api/icon/chat?fill=${getStuSenText(id, '4c5a6e', '4a89ca')}`}
            alt={`${id} send icon`}
            title={getStuSenText(id, locale('sendMsgStudent'), locale('sendMsgSensei'))}
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
    const {
        listState: { studentsList },
        setListState,
        chatState: { studentsChat },
        setChatState,
    } = useContext(StatesContext);
    const locale = useContext(localeContext);
    const { setSetting, getSetting } = useSetting();

    return (
        <img
            src={`/api/icon/${type}load?fill=000`}
            alt={`${type}load icon`}
            title={locale(type) + locale('jsonFile')}
            onClick={() => {
                if (type === 'up') uploadFile(file => {
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = e => {
                        const result = e.target?.result;
                        if (typeof result !== 'string') return;
                        const json: {
                            studentsList: ListState['studentsList'];
                            studentsChat: ChatState['studentsChat'];
                        } = JSON.parse(result);
                        setListState({ studentsList: json.studentsList })
                        setChatState({ studentsChat: json.studentsChat });
                        setSetting({ fileName: file.name.split('.')[0] });
                    }
                });
                if (type === 'down') downloadFile({ studentsList, studentsChat } || {}, `${getSetting().fileName}.json`);
            }}
        />
    );
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
    const locale = useContext(localeContext);
    if (!listState.studentsJson) return null;
    if (listState.student === 0) return (<p>{locale('selectStudents')}</p>);
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
    i?: number;
}

export default function Chat() {
    const { lo, locale } = useLocale(chat);

    //const { getSetting } = useSetting();

    const [listState, setListState] = getClassState(useState<ListState>({
        student: 0,
        studentsList: [10000, 10045],
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
        },
    }));
    const [contentMenu, setContentMenu] = getClassState(useState<ContentMenuSet>({
        x: 0,
        y: 0,
        content: [],
        display: false,
    }));

    useEffect(() => {
        let list: string = window.localStorage.studentsList;
        if (list !== undefined) {
            setListState({ studentsList: list.split(',').map(v => Number(v)) });
        }
        let chat: string = window.localStorage.studentsChat;
        if (chat !== undefined) {
            setChatState({ studentsChat: JSON.parse(chat) });
        }
    }, []);

    useEffect(() => {
        getStudentsJson(lo).then(r => setListState({ studentsJson: { data: r } }));
    }, [lo]);

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
                title={locale('idPromptTitle')}
                closeWindow={() => closeWindow(all, id)}
                element={close => (<>
                    <p>{fillBlank(locale('idPromptInfo'), locale(type || '+'))}</p>
                    <input type='number' onChange={e => { idPromptInputRef.current = Number(e.target.value); }} />
                    <button
                        onClick={() => {
                            if (type === '+') {
                                if (studentsList?.includes(idPromptInputRef.current)) {
                                    openWindow(all, TextAlert, { title: locale('error'), elem: locale('sameStudent') });
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
                                    openWindow(all, TextAlert, { title: locale('error'), elem: locale('withoutStudent') });
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
                    >{locale(type || '+')}</button>
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
        addNewWindow(SendMessage, (zIndex, winId, display, { studentsJson, selId, studentsChat, id, type, i }, all) => (
            <SendMessage.Component
                title={getStuSenText(id, locale('sendMsgStudent'), locale('sendMsgSensei'))}
                closeWindow={() => closeWindow(all, winId)}
                element={close => {
                    sendMessageInputRef.current = '';
                    return (<>
                        <p>
                            {fillBlank(
                                locale('sendMsgInfo'),
                                getStuSenText(
                                    id,
                                    locale('sendMsgStudentInfo'),
                                    locale('sendMsgSenseiInfo')
                                ),
                                getStudentInfo(
                                    studentsJson?.data || {},
                                    selId || 10000
                                ).schale?.Name,
                                locale(type)
                            )}
                        </p>
                        {type === 'text' && <textarea onChange={e => sendMessageInputRef.current = e.target.value} />}
                        {type === 'img' && <input onChange={e => sendMessageInputRef.current = e.target.value} />}
                        <button
                            onClick={() => {
                                if (!studentsChat) return;
                                //Can't be empty message
                                if (sendMessageInputRef.current.trim() === '') return;
                                //Get selected student's messageGroup
                                let messageData = studentsChat[String(selId)];
                                //Create newMsgData by input text
                                let newData: MessageData = { type, id, msg: sendMessageInputRef.current };
                                //Concat or Change newMsgData
                                if (i === undefined)
                                    studentsChat[String(selId)] =
                                        messageData ? messageData.concat(newData) : [newData];
                                else
                                    studentsChat[String(selId)][i] = newData;
                                //Set
                                setChatState({ studentsChat: studentsChat });
                                close();
                            }}
                        >{locale('sendMsg')}</button>
                    </>);
                }}
                zIndex={zIndex}
                display={display}
            />
        ));
    }, [lo]);

    useEffect(() => {
        listState.studentsList?.forEach(id => {
            if (listState.studentsJson?.data.schaleJson === undefined) return;
            if (getStudentInfo(listState.studentsJson.data, id).schale?.CollectionTexture !== undefined) return;
            openWindow(allWindow.all, TextAlert, {
                title: locale('error'),
                elem: fillBlank(locale('undefinedStudent'), String(id)),
                fun() {
                    openWindow(allWindow.all, IdPrompt, {
                        studentsList: listState.studentsList,
                        type: '+'
                    });
                },
            });
            const { studentsList } = listState;
            studentsList?.splice(studentsList?.indexOf(id), 1);
            window.localStorage.studentsList = studentsList?.join();
            setListState({ studentsList });
        });
    }, [listState.studentsList]);

    return (
        <MainNode onBodyClick={() => setContentMenu({ display: false })}>
            <NextSeo
                title={getTitle(locale('title'))}
            />
            <AllWindows zIndex={999} allWindow={allWindow} />
            <ContentMenu set={contentMenu} />
            <div id={styles.infoBar}>
                <div id={styles.title}>
                    <p id={styles.left}>{locale('student')}({listState.studentsList?.length})</p>
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
                    <p>{locale('allStudents')}</p>
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
                    setListState,
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
                        <localeContext.Provider value={locale}>
                            <SetCMMessageFunContext.Provider value={(e, i) => {
                                const stu = listState.student || 10000;
                                if (chatState.studentsChat === undefined) return;
                                let msgDatas = chatState.studentsChat;
                                const msgData = msgDatas[stu][i];
                                setContentMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    content: [
                                        {
                                            type: 'text', text: locale('copy'), onClick() {
                                                if (msgData.type === 'text') window.navigator.clipboard.writeText(msgData.msg || '')
                                                if (msgData.type === 'img') {
                                                    (async () => {
                                                        let img = await fetch(msgData.msg);
                                                        let blob = await img.blob();
                                                        let data = new ClipboardItem({
                                                            [blob.type]: blob
                                                        });
                                                        await window.navigator.clipboard.write([data]);
                                                    })().catch(reason => {
                                                        openWindow(allWindow.all, TextAlert, {
                                                            title: 'Error',
                                                            elem: String(reason),
                                                        });
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            type: 'text', text: locale('delete'), onClick() {
                                                msgDatas[stu].splice(i, 1);
                                                setChatState({ studentsChat: msgDatas });
                                            }
                                        },
                                        {
                                            type: 'text', text: locale('edit'), onClick() {
                                                const { id, type } = msgData;
                                                openWindow(allWindow.all, SendMessage, {
                                                    studentsJson: listState.studentsJson,
                                                    selId: listState.student,
                                                    studentsChat: chatState.studentsChat,
                                                    id,
                                                    type,
                                                    i,
                                                });
                                            }
                                        },
                                    ],
                                    display: true,
                                });
                            }}>
                                <Content />
                            </SetCMMessageFunContext.Provider>
                        </localeContext.Provider>
                    </SendMessageFunContext.Provider>
                </StatesContext.Provider>
            </div>
        </MainNode>
    );
}
