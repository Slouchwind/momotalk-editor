import type { AppProps } from 'next/app';

//Global Style
import '@/styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
    return (<Component {...pageProps} />);
}