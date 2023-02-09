import { AppFrame } from '@components/layouts/AppFrame';
import themeMoveThemes, { otherThemes } from '@constants/themes';
import manualCrawlService from '@services/manualCrawlService';
import { AppProvider, Banner, Spinner } from '@shopify/polaris';
import '@shopify/polaris-viz/build/esm/styles.css';
import '@shopify/polaris/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import '@styles/globals.css';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
const PolarisVizProvider = dynamic(() => import('@shopify/polaris-viz').then((module) => module.PolarisVizProvider), { ssr: false });

const BannerStyled = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  .Polaris-Banner {
    width: 400px;
  }
`;
export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await manualCrawl();
      setLoading(false);
    })();
  }, []);
  const manualCrawl = async () => {
    const promise = [];
    for (const theme of [...themeMoveThemes, ...otherThemes]) {
      promise.push(manualCrawlService(theme.themeId));
    }
    await Promise.allSettled(promise);
  };
  return (
    <AppProvider i18n={en}>
      <PolarisVizProvider>
        <BrowserRouter>
          {loading ? (
            <BannerStyled>
              <Banner title="Crawling themes..." status="info">
                <Spinner size="small" />
              </Banner>
            </BannerStyled>
          ) : (
            <AppFrame>
              <Head>
                <title>ThemeMove Tracking</title>
              </Head>
              <Component {...pageProps} />
            </AppFrame>
          )}
        </BrowserRouter>
      </PolarisVizProvider>
    </AppProvider>
  );
}
