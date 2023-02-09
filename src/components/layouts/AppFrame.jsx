import { Frame, Icon, Navigation } from '@shopify/polaris';
import {
  AnalyticsMajor,
  AnalyticsMinor,
  CategoriesMajor,
  HomeMajor,
  HomeMinor,
  MarketingMinor,
  OrdersMinor,
  ProductsMinor,
  SearchMajor,
  SearchMinor,
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import AppNavigation from './AppNavigation';
import { AppTopBar } from './AppTopBar';

export function AppFrame({ children, handleToggleTheme }) {
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const router = useRouter();

  const toggleMobileNavigationActive = useCallback(() => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive), []);

  return (
    <Frame
      topBar={<AppTopBar handleToggleTheme={handleToggleTheme} onNavigationToggle={toggleMobileNavigationActive} />}
      navigation={<AppNavigation />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      {children}
    </Frame>
  );
}
