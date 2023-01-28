import '@styles/globals.css';
import { AppProvider, Spinner } from '@shopify/polaris';
import '@shopify/polaris-viz/build/esm/styles.css';
import '@shopify/polaris/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import dynamic from 'next/dynamic';
import { BrowserRouter } from 'react-router-dom';
import { AppFrame } from '@components/layouts/AppFrame';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import autoCrawlService from '@services/autoCrawlService';
import manualCrawlService from '@services/manualCrawlService';
const PolarisVizProvider = dynamic(() => import('@shopify/polaris-viz').then((module) => module.PolarisVizProvider), { ssr: false });
export default function App({ Component, pageProps, posts }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      // await migrateTimestampService();
      try {
        // autoCrawlService();
        // setLoading(true);
        await manualCrawlService();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <AppProvider i18n={en}>
      <PolarisVizProvider>
        <BrowserRouter>
          <AppFrame>
            <Head>
              <title>ThemeMove Tracking</title>
            </Head>
            <Component {...pageProps} />
          </AppFrame>
        </BrowserRouter>
      </PolarisVizProvider>
    </AppProvider>
  );
}

export async function getStaticProps() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();

  return {
    props: {
      posts: data,
    },
  };
}
