import { Frame } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { AppNavigation } from './AppNavigation';
import { AppTopBar } from './AppTopBar';

export function AppFrame({ children, handleToggleTheme }) {
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

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
