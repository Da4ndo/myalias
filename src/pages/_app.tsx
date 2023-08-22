import { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MyAlias</title>
        <link rel="icon" href="/myalias.png" />
        {/* Add any other head elements here */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
