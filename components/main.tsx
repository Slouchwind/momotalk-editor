//Components
import Link from 'next/link';

//Styles
import styles from '@/styles/MainNode.module.scss';

//Methods
import { useRouter } from 'next/router';

function MomoTalkIcon() {
    return <img src='/api/icon/' alt='MomoTalk Icon' />;
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

export default function MainNode({ children }: { children: JSX.Element | JSX.Element[] }) {
    return (
        <div id={styles.main}>
            <div id={styles.MTStart}>
                <div>
                    <MomoTalkIcon />
                    <p className={styles.MTText}>MomoTalk</p>
                </div>
            </div>
            <div id={styles.MTBackground}>
                <div id={styles.MTBar}>
                    <Link href='/'>
                        <div id={styles.icon}>
                            <MomoTalkIcon />
                        </div>
                    </Link>
                    <p className={styles.MTText}>MomoTalk</p>
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