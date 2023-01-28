import { Navigation } from '@shopify/polaris';
import { AnalyticsMajor, CategoriesMajor, HomeMajor, SearchMajor } from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Nav = styled.div`
  .Polaris-Navigation {
    padding-top: var(--p-space-4);
    background-color: var(--p-background-pressed);
    border-right: none;
    border-right: 1px solid var(--p-divider);
  }
  [p-color-scheme='dark'] & .Polaris-Navigation {
    background-color: var(--p-surface-subdued);
  }
  .Polaris-Navigation__SectionHeading .Polaris-Navigation__Text {
    text-transform: uppercase;
  }
  .Polaris-Navigation__ListItem:not(:first-child) .Polaris-Navigation__Item {
    border-top: none;
  }
  .Polaris-Icon {
    width: 14px;
    height: 14px;
  }
  .Polaris-Navigation__Icon {
    margin-top: 0;
    margin-bottom: 0;
    height: auto;
    width: auto;
    align-self: center;
  }
  .Polaris-Navigation__Item {
    align-items: center;
    padding: var(--p-space-2) var(--p-space-3);
  }
  .Polaris-Navigation__Text {
    margin: 0;
  }
`;

const NavSection = ({ items, ...props }) => {
  const router = useRouter();

  return (
    <Navigation.Section
      {...props}
      items={items.map((item) => {
        const selected = location.pathname === item.url;

        return {
          label: item.label,
          icon: item.icon,
          onClick: () => router.push(item?.url),
          selected,
          subNavigationItems: item.subNavigationItems
            ? item.subNavigationItems.map((subItem) => {
                return {
                  label: subItem.label,
                  url: subItem.url,
                  selected,
                };
              })
            : [],
        };
      })}
    />
  );
};

export function AppNavigation() {
  const router = useRouter();
  return (
    <Nav>
      <Navigation location="">
        <Navigation.Section
          items={[
            {
              label: 'Dashboard',
              icon: HomeMajor,
              onClick: () => router.push('/'),
              selected: location.pathname === '/',
            },
          ]}
        />
        <NavSection
          separator
          title={'Page tabs'}
          items={[
            {
              label: 'Overview',
              icon: SearchMajor,
              url: '/overview',
            },
            {
              label: 'Top 5',
              icon: AnalyticsMajor,
              url: '/top-5',
            },
            {
              label: 'Category',
              icon: CategoriesMajor,
              url: '/category',
            },
            // {
            //   label: 'Others',
            //   icon: MobileHorizontalDotsMajor,
            //   url: '/pages/others',
            // },
          ]}
        />
      </Navigation>
    </Nav>
  );
}
