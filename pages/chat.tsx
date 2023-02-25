//Components
import { NextSeo } from 'next-seo';

//Methods
import getTitle from '@/components/title';

//Styles
import styles from '@/styles/Item.module.scss';

export default function Info() {
    return (
        <>
            <NextSeo
                title={getTitle('聊天编辑')}
            />
            <div id={styles.infoBar}>

            </div>
            <div id={styles.contentBar}>

            </div>
        </>
    );
}
