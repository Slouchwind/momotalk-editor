//Components
import { NextSeo } from 'next-seo';

//Methods
import { useState } from 'react';
import getTitle from '@/components/title';

//Styles
import styles from '@/styles/Item.module.scss';

function Student() {
    return (
        <div>
            <div className={styles.img}>
                <img className={styles.col} src='https://schale.gg/images/student/collection/Student_Portrait_Hoshino_Swimsuit_Collection.webp' />
            </div>
            <div className={styles.p}>
                <p className={styles.name}>星野(泳装)</p>
                <p className={styles.info}>午睡中~欢迎同道中人</p>
            </div>
            <div className={styles.line} />
        </div>
    );
}

export default function Info() {
    const [state, setState] = useState({ student: null });
    return (
        <>
            <NextSeo
                title={getTitle('学生信息')}
            />
            <div id={styles.infoBar}>
                <div id={styles.title}>
                    <p>学生(999)</p>
                </div>
                <div style={{ height: 70 }} />
                <div id={styles.all}>
                    <img src='/api/icon/line?fill=63adc6' />
                    <p>所有学生</p>
                </div>
                <div id={styles.students}>
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                    <Student />
                </div>
            </div>
            <div id={styles.contentBar}>
                {state.student ?
                    (
                        <div>

                        </div>
                    )
                    : (<p>请选择学生。</p>)
                }
            </div>
        </>
    );
}
