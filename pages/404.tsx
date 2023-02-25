//Components
import { NextSeo } from 'next-seo';

export default function NotFound() {
    return (
        <>
            <NextSeo
                title='404 Not Found'
            />
            <p>404 Not Found</p>
        </>
    );
}
