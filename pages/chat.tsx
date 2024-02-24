//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student from '@/components/students';
import ImgCol from '@/components/imgCol';
import ContentMenu from '@/components/contentMenu';
import InfoBar from '@/components/infoBar';
import getTitle from '@/components/title';
import { getAllStudentsList, getStudentInfo, getStudentsJson, getStuSenText } from '@/components/students/studentsMethods';
import Window, { AllWindows, getWindowFun } from '@/components/window';
import { SetStateFun, useClassState } from '@/components/extraReact';
import { downloadPNG, downloadFile, downloadSVG, uploadFile } from '@/components/loadFile';
import { getSettingFun } from '@/components/setting';

//Types
import type { RefObject } from 'react';
import type { MessageData } from '@/components/students';
import type { studentsJson } from '@/components/students/students';
import type { AllWindow } from '@/components/window';
import type { ContentMenuSet } from '@/components/contentMenu';

//Style
import styles from '@/styles/Chat.module.scss';

//i18n
import { fillBlank, useLocale } from '@/components/i18n';
import chat from '@/components/i18n/config/chat';

//Methods
import axios from 'axios';
import MinusCode from 'minus-code';
import { useEffect, useRef, createContext, useContext, ChangeEventHandler, Fragment, useState } from 'react';
import domToImage from 'dom-to-image';
import Providers from '@/components/providers';
import { filterObject } from '@/components/extraObject';

const mccode = new MinusCode();

const StatesContext = createContext<{
    allWindow: AllWindow;
    listState: ListState;
    setListState: SetStateFun<ListState>;
    chatState: ChatState;
    setChatState: SetStateFun<ChatState>;
}>({
    allWindow: {},
    listState: {
        student: 0,
        studentsList: [],
        studentsJson: {
            data: {}
        },
    },
    setListState: () => { },
    chatState: {
        studentsChat: {},
    },
    setChatState: () => { },
});

/**發送消息的函數 */
const SendMessageFunContext = createContext<(
    id: MessageData['id'],
    type?: MessageData['type'],
) => void>(() => { });

const localeContext = createContext<(key: keyof typeof chat) => string>((key: keyof typeof chat) => key);

/**顯示消息的右鍵菜單的函數 */
const SetCMMessageFunContext = createContext<(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    i: number
) => void
>(() => { });

const ContentContext = createContext<RefObject<HTMLDivElement>>({ current: null });

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
    else if (type === 'time') return (<div id={styles.time}>{msg}</div>);
    else return (<Fragment />);
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
    const allInfo = studentsJson.data;

    function contextMenuHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        fun(e, i);
    }

    if (id === 'sensei') {
        return (
            <div
                className={styles.sensei}
                onContextMenu={contextMenuHandler}
            >
                <Msg msg={msg} type={type} />
            </div>
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
                    id={id}
                />
                <div id={styles.right}>
                    <p>{info.schale?.Name}</p>
                    <div onContextMenu={contextMenuHandler}>
                        <Msg msg={msg} type={type} />
                    </div>
                </div>
            </div>
        );
    }
}

function MessagesGroup() {
    const { listState: { student }, chatState: { studentsChat } } = useContext(StatesContext);
    const data = studentsChat[String(student)];
    return (<>
        {data?.map((v, i) => (
            <Message
                id={v.id}
                msg={(() => {
                    if (v.type === 'text')
                        return v.msg.split('\n').map((value, index) => (<p key={index}>{value}</p>));
                    else if (v.type === 'img') return (<img src={v.msg} alt={`${v.type} message image ${i}`} />);
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
    type: 'up' | 'down' | 'svg' | 'png';
}

function Loader({ type }: LoaderState) {
    const { setSetting, getSetting } = getSettingFun();

    const {
        listState: { student, studentsList },
        setListState,
        chatState: { studentsChat },
        setChatState,
    } = useContext(StatesContext);
    const locale = useContext(localeContext);
    const contentRef = useContext(ContentContext);

    return (
        <img
            src={`/api/icon/${type}load?fill=000`}
            alt={`${type}load icon`}
            title={locale(type)}
            onClick={() => {
                if (type === 'up')
                    uploadFile(async (asyncFile, name) => {
                        let { files } = await asyncFile;
                        let jsonFile = await files['messageData.json'].async('string');
                        let json = JSON.parse(jsonFile);
                        setListState({ studentsList: json.studentsList })
                        setChatState({ studentsChat: json.studentsChat });
                        setSetting({ fileName: name.split('.')[0] });
                    });
                else if (type === 'down')
                    downloadFile({
                        studentsList,
                        studentsChat: filterObject(studentsChat, k => studentsList.includes(Number(k))),
                    }, `${getSetting().fileName}.mte`);
                else if (type === 'svg')
                    (async () => {
                        let contentEle = contentRef.current;
                        if (!contentEle) return;
                        let data = mccode.encode(
                            contentEle.innerHTML
                                .replace(/Chat_([\w]+)__\w{5}/g, '$1')
                                .replace(/<div id="editor".*>/g, '')
                                .replace(/<img(.*?)>/g, '<img$1/>') as string
                        );
                        let w = getSetting().SVGWidth;
                        let h = contentEle.scrollHeight;
                        let img = await axios.post<string>(`/api/msg?w=${w}&h=${h}`, { data });
                        downloadSVG(img.data, getSetting().fileName + '-' + student);
                    })();
                else if (type === 'png')
                    (async () => {
                        let node = contentRef.current;
                        if (!node) return;
                        let editorNode = node.childNodes[node.childNodes.length - 1];
                        let w = getSetting().SVGWidth;
                        let h = node.scrollHeight;
                        let url = await domToImage.toPng(node, {
                            bgcolor: '#fff',
                            filter: (n) => editorNode !== n,
                            width: Number(w),
                            height: h,
                        });
                        downloadPNG(url, getSetting().fileName + '-' + student);
                    })();
            }}
        />
    );
}

function ChatEditorBar() {
    const { listState } = useContext(StatesContext);
    return (
        <div id={styles.editor}>
            {listState.student !== 0 && (<>
                <Sender id={listState.student} />
                <Sender id='sensei' />
            </>)}
            <Loader type='up' />
            <Loader type='down' />
            <Loader type='svg' />
            <Loader type='png' />
        </div>
    );
}

function Content() {
    const { listState } = useContext(StatesContext);
    const locale = useContext(localeContext);

    const contentRef = useRef<HTMLDivElement>(null);
    return (
        <div id={styles.content} ref={contentRef}>
            {listState.student === 0 && (<div id={styles.center}><p>{locale('selectStudents')}</p></div>)}
            {listState.student !== 0 && (<MessagesGroup />)}
            <ContentContext.Provider value={contentRef}>
                <ChatEditorBar />
            </ContentContext.Provider>
        </div>
    );
}

interface StudentsSelectorProps {
    schaleJson: ListState['studentsJson']['data']['schaleJson'];
    studentsList: number[];
    onClick: (id: number) => void;
    selectStudents: { [id: string]: boolean };
}

function StudentsSelector({ schaleJson, studentsList, onClick, selectStudents }: StudentsSelectorProps) {
    let chooseStudentsList = Object.entries(selectStudents).filter(v => v[1]).map(v => Number(v[0]));
    let selector = schaleJson?.map(({ Id: id }) => {
        if (!studentsList.includes(id)) return;
        return (
            <ImgCol
                style={{
                    cursor: 'pointer',
                    margin: 7.5,
                    ...(chooseStudentsList.includes(id) && {
                        boxShadow: '0 0 10px 0px #000000A4'
                    }),
                }}
                size={60}
                id={id}
                key={id}
                onClick={() => onClick(id)}
            />
        );
    });
    return (<div className='selector'>{selector}</div>);
}

interface ListState {
    student: number;
    studentsList: number[];
    studentsJson: {
        data: studentsJson;
    };
}

interface ChatState {
    studentsChat: { [x: string]: MessageData[] };
}

interface IdPromptArg {
    schaleJson: ListState['studentsJson']['data']['schaleJson'];
    studentsList: ListState['studentsList'];
    type?: '+' | '-';
}

interface TextAlertArg {
    title: string;
    elem: React.ReactNode;
    fun?: () => any;
}

interface SendMessageArg {
    studentsJson: ListState['studentsJson'];
    selId: ListState['student'];
    studentsChat: ChatState['studentsChat'];
    id: MessageData['id'];
    type: MessageData['type'];
    i?: number;
}

interface IdConfirmArg {
    studentsList: ListState['studentsList'];
    studentsChat: ChatState['studentsChat'];
    student: number;
    textInfo: string;
}

export default function Chat() {
    const { lo, locale } = useLocale(chat);

    const [listState, setListState] = useClassState<ListState>({
        student: 0,
        studentsList: [10000, 10045],
        studentsJson: { data: {} },
    });
    const [chatState, setChatState] = useClassState<ChatState>({
        studentsChat: {
            "10000": [
                { type: 'text', id: 10000, msg: '这是什么？' },
                { type: 'text', id: 'sensei', msg: '这是什么？' },
            ],
            "10045": [
                { type: 'text', id: 10045, msg: '好热啊~\n一动不动还是好热啊~' },
            ]
        },
    });
    const [contentMenu, setContentMenu] = useClassState<ContentMenuSet>({
        x: 0,
        y: 0,
        content: [],
        display: false,
    });

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
        getStudentsJson(lo).then(
            r => setListState({ studentsJson: { data: r } }),
            r => openWindow(allWindow.all, TextAlert, {
                title: locale('error'),
                elem: r
            })
        );
    }, [lo]);

    //Window
    const { allWindow, addNewWindow, openWindow, closeWindow } = getWindowFun(
        useClassState<AllWindow>({
            all: [],
            component: {},
        })
    );

    //IdPrompt
    const idPromptInputRef = useRef<{ [id: string]: boolean }>({});
    const IdPrompt = new Window<IdPromptArg>('IdPrompt');

    //Alert
    const TextAlert = new Window<TextAlertArg>('TextAlert');

    //Message
    const sendMessageInputRef = useRef('');
    const SendMessage = new Window<SendMessageArg>('SendMessage');

    //Confirm
    const IdConfirm = new Window<IdConfirmArg>('IdConfirm');

    useEffect(() => {
        addNewWindow(IdPrompt, (zIndex, id, display, { schaleJson, studentsList, type }, all) => (
            <IdPrompt.Component
                title={locale('idPromptTitle')}
                closeWindow={() => closeWindow(all, id)}
                element={close => {
                    return (
                        <>
                            <p>{fillBlank(locale('idPromptInfo'), locale(type || '+'))}</p>
                            <StudentsSelector
                                schaleJson={schaleJson}
                                studentsList={type === '+' ?
                                    getAllStudentsList({ schaleJson }).filter(v => !studentsList.includes(v)) :
                                    studentsList}
                                onClick={(id) => {
                                    let selectStudent = idPromptInputRef.current[String(id)];
                                    idPromptInputRef.current[String(id)] = !selectStudent;
                                }}
                                selectStudents={idPromptInputRef.current}
                            />
                            <button
                                onClick={() => {
                                    let chooseStudentsList = Object.entries(idPromptInputRef.current).filter(v => v[1]).map(v => Number(v[0]));
                                    if (type === '+') {
                                        studentsList.push(...chooseStudentsList);
                                        window.localStorage.studentsList = studentsList?.join();
                                        setListState({ studentsList });
                                        close();
                                    }
                                    else if (type === '-') {
                                        chooseStudentsList.forEach(id => {
                                            const i = studentsList.indexOf(id);
                                            studentsList.splice(i, 1);
                                        });
                                        window.localStorage.studentsList = studentsList.join();
                                        setListState({
                                            student: 0,
                                            studentsList,
                                        });
                                        close();
                                    }
                                    idPromptInputRef.current = {};
                                }}
                            >{locale(type || '+')}</button>
                        </>
                    );
                }}
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
                    const props: {
                        defaultValue?: string;
                        onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
                    } = {
                        defaultValue: i !== undefined ? studentsChat[String(selId)][i].msg : undefined,
                        onChange(e) { sendMessageInputRef.current = e.target.value },
                    };
                    return (<>
                        <p>
                            {fillBlank(
                                locale('sendMsgInfo'),
                                type === 'time' ? '' : locale('sendMsgSenseiInfo'),
                                type === 'time' ? '' : getStuSenText(
                                    id,
                                    locale('sensei'),
                                    getStudentInfo(
                                        studentsJson.data,
                                        selId
                                    ).schale?.Name || String(selId)
                                ),
                                locale(type)
                            )}
                        </p>
                        {type === 'text' && <textarea {...props} />}
                        {type === 'img' && <input {...props} />}
                        {type === 'time' && <textarea {...props} />}
                        <button
                            onClick={() => {
                                if (!studentsChat) return;
                                if (sendMessageInputRef.current.trim() === '') return;
                                let messageData = studentsChat[String(selId)];
                                let newData: MessageData = { type, id, msg: sendMessageInputRef.current };
                                if (i === undefined)
                                    studentsChat[String(selId)] =
                                        messageData ? messageData.concat(newData) : [newData];
                                else
                                    studentsChat[String(selId)][i] = newData;
                                setChatState({ studentsChat });
                                close();
                            }}
                        >{locale('sendMsg')}</button>
                    </>);
                }}
                zIndex={zIndex}
                display={display}
            />
        ));
        addNewWindow(IdConfirm, (zIndex, id, display, { studentsList, studentsChat, student, textInfo }, all) => (
            <IdConfirm.Component
                title={locale('idConfirmTitle')}
                closeWindow={() => closeWindow(all, id)}
                element={close => (<>
                    <p>{fillBlank(locale('idConfirmInfo'), textInfo)}</p>
                    <div>
                        <button
                            onClick={() => {
                                if (!studentsList?.includes(student)) {
                                    openWindow(all, TextAlert, { title: locale('error'), elem: locale('withoutStudent') });
                                }
                                else {
                                    const i = studentsList.indexOf(student);
                                    studentsList.splice(i, 1);
                                    const datas = studentsChat;
                                    delete datas[String(student)];
                                    window.localStorage.studentsList = studentsList?.join();
                                    setListState({
                                        student: 0,
                                        studentsList,
                                    });
                                    setChatState({ studentsChat: datas });
                                    close();
                                }
                            }}
                        >{locale('confirm')}</button>
                        <button className='cancel' onClick={() => close()}>{locale('cancel')}</button>
                    </div>
                </>)}
                zIndex={zIndex}
                display={display}
            />
        ));
    }, [lo]);

    useEffect(() => {
        listState.studentsList.forEach(id => {
            if (listState.studentsJson.data.schaleJson === undefined) return;
            if (getStudentInfo(listState.studentsJson.data, id).schale?.Name !== undefined) return;
            openWindow(allWindow.all, TextAlert, {
                title: locale('error'),
                elem: fillBlank(locale('undefinedStudent'), String(id)),
                fun() {
                    openWindow(allWindow.all, IdPrompt, {
                        schaleJson: listState.studentsJson.data.schaleJson,
                        studentsList: listState.studentsList,
                        type: '+'
                    });
                },
            });
            const { studentsList } = listState;
            studentsList.splice(studentsList.indexOf(id), 1);
            window.localStorage.studentsList = studentsList.join();
            setListState({ studentsList });
        });
    }, [listState.studentsList]);

    return (
        <MainNode onBodyClick={() => {
            const contentMenu = document.getElementById('contentMenu') as HTMLDivElement | undefined;
            if (!contentMenu) return;
            contentMenu.style.animationName = 'fadeOut';
            contentMenu.addEventListener('animationend', () => setContentMenu({ display: false }));
        }}>
            <NextSeo
                title={getTitle(locale('title'))}
            />
            <AllWindows zIndex={999} allWindow={allWindow} />
            <ContentMenu set={contentMenu} />
            <InfoBar
                styles={styles}
                locale={locale}
                studentsList={listState.studentsList}
                right={(['+', '-'] as ('+' | '-')[]).map(v => (
                    <p title={locale(v) + locale('student') + ''} key={v} onClick={_ => {
                        openWindow(allWindow.all, IdPrompt, {
                            schaleJson: listState.studentsJson.data.schaleJson,
                            studentsList: listState.studentsList,
                            type: v,
                        });
                    }}>{v}</p>
                ))}
                students={id => (
                    <Student
                        id={id}
                        allInfo={listState.studentsJson.data}
                        onClick={() => setListState({ student: id })}
                        select={listState.student === id}
                        onContentMenu={e => {
                            const info = getStudentInfo(listState.studentsJson?.data as studentsJson, id);
                            setContentMenu({
                                x: e.clientX,
                                y: e.clientY,
                                content: [
                                    { type: 'title', text: `${info.schale?.Name || ''} id: ${id}` },
                                    { type: 'separator', color: '#ccc', height: 1 },
                                    {
                                        type: 'text', text: locale('delete'), onClick() {
                                            openWindow(allWindow.all, IdConfirm, {
                                                student: id,
                                                textInfo: info.schale?.Name as string,
                                                studentsList: listState.studentsList,
                                                studentsChat: chatState.studentsChat,
                                            });
                                        }
                                    },
                                ],
                                display: true,
                            });
                        }}
                        infoText={() => {
                            const chat = chatState.studentsChat[String(id)];
                            if (chat === undefined) return ' ';
                            if (chat.length === 0) return ' ';
                            return chat[chat.length - 1].msg || ' ';
                        }}
                    />
                )}
            />
            <div id={styles.contentBar}>
                <Providers
                    providers={[
                        <StatesContext.Provider key='states' value={{ allWindow, listState, setListState, chatState, setChatState }} />,
                        <SendMessageFunContext.Provider key='sendMessageFun' value={(id, type = 'text') => {
                            openWindow(allWindow.all, SendMessage, {
                                studentsJson: listState.studentsJson,
                                selId: listState.student,
                                studentsChat: chatState.studentsChat,
                                id, type
                            });
                        }} />,
                        <localeContext.Provider key='locale' value={locale} />,
                        <SetCMMessageFunContext.Provider key='setCMMessageFun' value={(e, i) => {
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
                                            else if (msgData.type === 'img') {
                                                (async () => {
                                                    let img = await axios.get<Response>(msgData.msg);
                                                    let blob = await img.data.blob();
                                                    let data = new ClipboardItem({ [blob.type]: blob });
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
                                                id, type, i
                                            });
                                        }
                                    },
                                ],
                                display: true,
                            });
                        }} />,
                    ]}
                    element={<Content />}
                />
            </div>
        </MainNode>
    );
}