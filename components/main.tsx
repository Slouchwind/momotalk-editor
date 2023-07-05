//Components
import Link from 'next/link';
import { SettingForm, getSettingFun } from '@/components/setting';

//Styles
import styles from '@/styles/MainNode.module.scss';

//Methods
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Window, { AllWindow, AllWindows, getWindowFun } from './window';
import { Locales, fillBlank, useLocale } from './i18n';
import main from './i18n/config/main';
import { Settings, SettingArg } from '@/components/setting';
import setFontWeight, { fontWeightNames } from './setFontWeight';

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

function MTStart() {
    const [ani, setAni] = useState<'true' | 'false'>('false');
    useEffect(() => {
        const { animation } = window.sessionStorage;
        if (animation !== undefined) setAni(animation);
        else {
            window.sessionStorage.animation = 'false';
            setAni('true');
        }
    }, []);

    const [animation, setAnimation] = useState<Settings['animation']>();
    const { getSetting } = getSettingFun();
    useEffect(() => {
        setAnimation(getSetting().animation);
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
    const { lo, locale, localeString } = useLocale(main);

    const { getSetting, setSetting, windowOnload } = getSettingFun();
    useEffect(() => {
        windowOnload();
        setFontWeight(getSetting().fontWeight);
    }, []);

    const { allWindow, addNewWindow, openWindow, closeWindow } = getWindowFun({
        all: [],
        component: {},
    });

    const Setting = new Window<SettingArg>('Setting');

    useEffect(() => {
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
                                title: fillBlank(locale('requiredReload'), locale('setLocaleTitle')),
                                values: ['zh-CN', 'zh-TW', 'en-US'],
                                defaultValue: setting.locale,
                                getValue: v => locale('locales', v),
                            },
                            animation: {
                                type: 'option',
                                label: locale('setAnimation'),
                                title: fillBlank(locale('requiredReload'), locale('setAnimationTitle')),
                                values: ['none', 'first', 'every'],
                                defaultValue: setting.animation,
                                getValue: v => localeString('animationT' + v),
                            },
                            fontWeight: {
                                type: 'option',
                                label: locale('setFontWeight'),
                                values: fontWeightNames,
                                defaultValue: setting.fontWeight,
                                getValue: v => localeString('fontT' + v),
                            },
                            fileName: {
                                page: '/chat',
                                type: 'input',
                                label: locale('setFileName'),
                                defaultValue: setting.fileName,
                            },
                            SVGWidth: {
                                page: '/chat',
                                type: 'number',
                                label: locale('setSVGWidth'),
                                defaultValue: setting.SVGWidth,
                            }
                        }}
                        confirm={locale('confirm')}
                        onSubmit={data => {
                            setFontWeight(data.fontWeight as Settings['fontWeight']);
                            setSetting(data as Settings);
                            close();
                        }}
                        otherButtons={<>
                            <button onClick={() => window.location.reload()}>{locale('reload')}</button>
                            <button onClick={() => close()} className='cancel'>{locale('cancel')}</button>
                        </>}
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
            <MTStart />
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
                                setting: getSetting(),
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