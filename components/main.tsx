//Components
import Link from 'next/link';
import { SettingForm, useSetting } from '@/components/setting';

//Styles
import styles from '@/styles/MainNode.module.scss';

//Methods
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Window, { AllWindow, AllWindows, getWindowFun } from './window';
import { Locales, i18nContents, useLocale } from './i18n';
import main from './i18n/config/main';
import { SettingState, SettingArg } from '@/components/setting';

function MomoTalkIcon() {
    return (
        <Link href='/'>
            <div id={styles.icon}>
                <img src='/api/icon/' alt='MomoTalk Icon' />
            </div>
        </Link>
    );
}

function MTBarLink({ type }: { type: string }) {
    const router = useRouter();
    return (
        <Link href={'/' + type} className={(('/' + type) === router.pathname) ? styles.nowLink : styles.notLink}>
            <div>
                <img
                    src={`/api/icon/${type}`}
                    alt={`${type} Icon`}
                />
            </div>
        </Link>
    );
}

function MTStart({ animation }: { animation: SettingState['animation'] }) {
    const [ani, setAni] = useState<'true' | 'false'>('false');
    useEffect(() => {
        const { animation } = window.sessionStorage;
        if (animation !== undefined) setAni(animation);
        else {
            window.sessionStorage.animation = 'false';
            setAni('true');
        }
    }, []);

    const userAni = (() => {
        if (animation === 'none' || animation === undefined) return 'false';
        else if (animation === 'first') return ani;
        else if (animation === 'every') return 'true';
    })();
    return <>{userAni === 'true' && (
        <div id={styles.MTStart}>
            <div>
                <MomoTalkIcon />
                <p className={styles.MTText}>MomoTalk</p>
            </div>
        </div>
    )}</>;
}

export default function MainNode({ children, onBodyClick }: {
    children: React.ReactNode;
    onBodyClick?: React.MouseEventHandler;
}) {
    const { lo, locale, localeType } = useLocale(main);

    const { setting, setSetting } = useSetting({
        locale: lo,
        animation: 'first',
        fileName: 'untitled',
    });

    const {
        allWindow,
        addNewWindow,
        openWindow,
        closeWindow,
    } = getWindowFun(useState<AllWindow>({ all: [], component: {} }));

    const Setting = new Window<SettingArg>('Setting');

    useEffect(() => {
        const animations = ['none', 'first', 'every'];
        addNewWindow(Setting, (zIndex, id, display, { setting, setSetting }, all) => (
            <Setting.Component
                title={locale('setting')}
                closeWindow={() => closeWindow(all, id)}
                element={close => (
                    <SettingForm
                        option={{
                            locale: {
                                type: 'option',
                                label: locale('setLocale'),
                                values: ['zh-CN', 'zh-TW'] as Locales[],
                                defaultValue: setting.locale,
                                getValue: v => (<option value={v}>{locale('locales', v)}</option>),
                            },
                            animation: {
                                type: 'option',
                                label: locale('setAnimation'),
                                values: animations,
                                defaultValue: setting.animation,
                                getValue: v => (<option value={v}>{localeType('animationT' + v)}</option>),
                            },
                            fileName: {
                                page: '/chat',
                                type: 'input',
                                label: locale('setFileName'),
                                defaultValue: setting.fileName,
                            }
                        }}
                        done={locale('done')}
                        onSubmit={data => {
                            setSetting(data as SettingState);
                            close();
                        }}
                    />
                )}
                zIndex={zIndex}
                display={display}
            />
        ));
    }, [lo]);

    return (
        <div id={styles.main} onClick={onBodyClick}>
            <AllWindows zIndex={1099} allWindow={allWindow} />
            <MTStart animation={setting.animation} />
            <div id={styles.MTBackground}>
                <div id={styles.MTBar}>
                    <div id={styles.left}>
                        <MomoTalkIcon />
                        <p className={styles.MTText}>MomoTalk</p>
                    </div>
                    <div id={styles.right}>
                        <img
                            src='/api/icon/setting'
                            onClick={() => openWindow(allWindow.all, Setting, {
                                setting: JSON.parse(window.localStorage.set),
                                setSetting,
                            })}
                        />
                    </div>
                </div>
                <div id={styles.MTContents}>
                    <div id={styles.MTLeftBar}>
                        <MTBarLink type='info' />
                        <MTBarLink type='chat' />
                    </div>
                    <div id={styles.MTMain}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}