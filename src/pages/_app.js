import { AppFrame } from '@components/layouts/AppFrame';
import themeMoveThemes, { otherThemes } from '@constants/themes';
import manualCrawlService from '@services/manualCrawlService';
import { AppProvider, Spinner } from '@shopify/polaris';
import '@shopify/polaris-viz/build/esm/styles.css';
import '@shopify/polaris/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import '@styles/globals.css';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
const PolarisVizProvider = dynamic(() => import('@shopify/polaris-viz').then((module) => module.PolarisVizProvider), { ssr: false });
export default function App({ Component, pageProps }) {
  useEffect(() => {
    manualCrawl();
  }, []);
  const manualCrawl = () => {
    for (const theme of [...themeMoveThemes, ...otherThemes]) {
      manualCrawlService(theme.themeId);
    }
  };
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
