//Components
import { NextSeo } from 'next-seo';

//Methods
import getTitle from '@/components/title';

export default function Home() {
    return (
        <>
            <NextSeo
                title={getTitle()}
            />
            <p>请选择栏目。</p>
        </>
    );
}
