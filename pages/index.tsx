//Components
import { NextSeo } from 'next-seo';
import MainNode from '@/components/main';

//Methods
import getTitle from '@/components/title';

export default function Home() {
    return (
        <MainNode>
            <NextSeo
                title={getTitle()}
            />
            <p>请选择栏目。</p>
        </MainNode>
    );
}
