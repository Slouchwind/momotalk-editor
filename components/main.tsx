//Components
import Link from 'next/link';

//Styles
import styles from '@/styles/MainNode.module.scss';

//Methods
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    const [start, setStart] = useState<'true' | 'false'>('false');
    useEffect(() => {
        const { animation } = window.sessionStorage;
        if (animation !== undefined) setStart(animation);
        else {
            window.sessionStorage.animation = 'false';
            setStart('true');
        }
    }, [])
    return <>{start === 'true' && (
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
    return (
        <div id={styles.main} onClick={onBodyClick}>
            <MTStart />
            <div id={styles.MTBackground}>
                <div id={styles.MTBar}>
                    <div id={styles.left}>
                        <MomoTalkIcon />
                        <p className={styles.MTText}>MomoTalk</p>
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