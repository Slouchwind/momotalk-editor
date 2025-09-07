//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';
import Student from '@/components/students';

//Types
import type { studentsJson } from '@/components/students/students';

//Styles
import styles from '@/styles/Info.module.scss';

//i18n
import { useLocale } from '@/components/i18n';
import info from '@/components/i18n/config/info';

//Methods
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import getTitle from '@/components/title';
import { getAllStudentsList, getStudentInfo, getStudentsJson } from '@/components/students/studentsMethods';
import { useClassState } from '@/components/extraReact';
import InfoBar from '@/components/infoBar';
import { AllStudentsIcon } from '@/components/students';

interface ContentProps {
    id: number,
    allInfo: studentsJson,
    lo: string
}

function Content({ id, allInfo, lo }: ContentProps) {
    const info = getStudentInfo(allInfo, id);
    const bio = info.file?.bio;
    const bioText = typeof bio === 'object' && bio !== null ? bio[lo] || bio['zh-CN'] : bio;
    return (
        <div id={styles.content}>
            <div className={styles.img}>
                <img
                    className={styles.col}
                    src={`https://schale.gg/images/student/collection/${id}.webp`}
                    alt={`${id} collection image`}
                />
            </div>
            <div className={styles.p}>
                <p className={styles.name}>{info.schale?.Name}</p>
                <p className={styles.info}>{bioText}</p>
            </div>
            <div className={styles.birthday}>
                <img
                    src='/api/icon/birth?fill=5f7c8c'
                    alt={`${info.schale?.Name} birthday icon`}
                />
                <p>{info.schale?.Birthday}</p>
            </div>
        </div>
    );
}

interface State {
    student: number;
    studentsJson: {
        data: studentsJson;
    };
}

export default function Info() {
    const { lo, locale } = useLocale(info);
    const [state, setState] = useClassState<State>({
        student: 0,
        studentsJson: { data: {} }
    });

    const [allStuList, setAllStuList] = useState<number[]>([]);
    const [isContentBarVisible, setIsContentBarVisible] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        getStudentsJson(lo).then(r => {
            setAllStuList(getAllStudentsList(r));
            setState({ studentsJson: { data: r } });
        });
    }, [lo]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 580) {
                setIsContentBarVisible(true);
            } else {
                setIsContentBarVisible(false);
                setState({ student: 0 });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <MainNode>
            <NextSeo
                title={getTitle(locale('title'))}
            />
            <InfoBar
                styles={styles}
                locale={locale}
                studentsList={allStuList}
                students={id => (
                    <Student
                        id={id}
                        allInfo={state.studentsJson.data}
                        key={id}
                        onClick={_ => {
                            setState({ student: id });
                            setIsContentBarVisible(true);
                        }}
                        select={state.student === id}
                    />
                )}
            />
            <div id={styles.contentBar} className={isContentBarVisible ? styles.showContentBar : ''}>
                {state.student !== 0 ?
                    <>
                        <div className={styles.header}>
                            <div className={styles.closeButton} onClick={() => {
                                setIsContentBarVisible(false);
                                setState({ student: 0 });
                            }}>
                                <img src='/api/icon/close' alt='close' />
                            </div>
                        </div>
                        <Content id={state.student} allInfo={state.studentsJson.data} lo={lo} />
                    </>
                    :
                    <p>{locale('selectStudents')}</p>
                }
            </div>
        </MainNode>
    );
}