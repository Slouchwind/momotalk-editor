import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang='zh-CN'>
            <Head>
                <link rel="icon" href="/api/icon" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}