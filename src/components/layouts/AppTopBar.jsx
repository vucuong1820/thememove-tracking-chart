import { TopBar } from '@shopify/polaris';
import Link from 'next/link';
import AppLogo from 'public/logo.png';
import styled from 'styled-components';
const TopBarWrapper = styled.div`
  .Polaris-TopBar__LogoContainer {
    display: flex;
    justify-content: center;
    padding-left: 0;
    a {
      display: flex;
      text-decoration: none;
      padding-left: calc(var(--p-space-4) + env(safe-area-inset-left));
      align-items: center;
      color: unset;
      font-weight: bold;
      font-size: 24px;
      width: max-content;
    }
    .app-logo {
      width: 80px;
      height: 30px;
      margin-right: 40px;
    }
  }
`;

export function AppTopBar() {
  const searchFieldMarkup = (
    <>
      <div className="Polaris-TopBar__LogoContainer Polaris-TopBar__LogoDisplayControl">
        <Link href="/">
          <img className="app-logo" src={AppLogo?.src} />
          ThemeMove Tracking Chart
        </Link>
      </div>
    </>
  );

  return (
    <TopBarWrapper>
      <TopBar searchField={searchFieldMarkup} />
    </TopBarWrapper>
  );
}
