//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';

//i18n
import { useLocale } from '@/components/i18n';
import index from '@/components/i18n/config/indexConfig';

//Methods
import getTitle from '@/components/title';

export default function Home() {
    const { locale } = useLocale(index);
    return (
        <MainNode>
            <NextSeo
                title={getTitle()}
            />
            <p>{locale('selectingText')}</p>
        </MainNode>
    );
}
