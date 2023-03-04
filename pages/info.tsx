//Components
import { NextSeo } from 'next-seo';

//Methods
import { useState } from 'react';
import getTitle from '@/components/title';
import { getStudentInfo, getStudentJson, Main } from '@/components/students';

//Styles
import styles from '@/styles/Item.module.scss';

function Repeat<T>({ variable, repeat, func, components }: {
    variable: T,
    repeat: number,
    func: (variable: T) => T,
    components: (variable: T) => JSX.Element,
}) {
    const array = new Array(repeat).fill(null);
    array.forEach((_, i) => {
        array[i] = components(variable);
        variable = func(variable);
    });
    return <>{array}</>;
}

function Student({ id, allInfo }: { id: number, allInfo: Main }) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div>
            <div className={styles.img}>
                <img className={styles.col} src={info.schale && `https://schale.gg/images/student/collection/${info.schale.CollectionTexture}.webp`} />
            </div>
            <div className={styles.p}>
                <p className={styles.name}>{info.schale && info.schale.Name}</p>
                <p className={styles.info}>{info.json && info.json.info}</p>
            </div>
            <div className={styles.line} />
        </div>
    );
}

export default function Info() {
    const [state, setState] = useState<{
        student: number,
        MainInfo: {
            data: Main,
            fetch: boolean,
        }
    }>({
        student: 0,
        MainInfo: { data: {}, fetch: false }
    });
    if (!state.MainInfo.fetch) getStudentJson().then(r => setState({
        student: state.student,
        MainInfo: { data: r, fetch: true }
    }));
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
                    {state.MainInfo.fetch &&
                        <Repeat
                            variable={10000}
                            repeat={50}
                            func={v => v + 1}
                            components={v => <Student id={v} allInfo={state.MainInfo.data} key={v} />}
                        />
                    }
                </div>
            </div>
            <div id={styles.contentBar}>
                {state.student !== 0 ?
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
