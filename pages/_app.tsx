import type { AppProps } from 'next/app';
import MainNode from '@/components/main';

//Global Style
import '@/styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MainNode>
            <Component {...pageProps} />
        </MainNode>
    );
}