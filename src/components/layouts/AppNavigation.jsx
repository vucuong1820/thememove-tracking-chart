import { CATEGORIES, TOP5_THEMES } from '@constants/chart';
import { Icon } from '@shopify/polaris';
import { AnalyticsMajor, CaretDownMinor, CategoriesMajor, HomeMajor, SearchMajor } from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  .Polaris-Icon__Svg {
    width: var(--p-space-4);
    height: var(--p-space-4);
  }
  .Polaris-Navigation__SectionHeading .Polaris-Navigation__Text {
    text-transform: uppercase;
  }
  .Polaris-Navigation__ItemInnerWrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .Polaris-Navigation__SecondaryNavigation {
    display: none;
    &.Polaris-Navigation--isExpanded {
      display: block;
    }
  }
  .toggleIcon {
    margin-right: var(--p-space-1);
    .Polaris-Icon__Svg {
      width: var(--p-space-6);
      height: var(--p-space-6);
    }
    cursor: pointer;
    &:hover {
      background: var(--p-surface-neutral);
    }
  }
  .expandIcon {
    .Polaris-Icon {
      transition: all 0.1s ease 0s;
      transform: rotate(-90deg);
    }
  }
`;
const navList = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: HomeMajor,
        url: '/',
      },
    ],
  },
  {
    separator: true,
    title: 'Page tabs',
    items: [
      {
        label: 'Overview',
        icon: SearchMajor,
        url: '/overview',
      },
      {
        label: 'Top 5',
        icon: AnalyticsMajor,
        url: '/top-5',
        subNavigationItems: TOP5_THEMES.map((theme) => ({ label: theme, url: `/top-5?theme=${theme}` })),
      },
      {
        label: 'Category',
        icon: CategoriesMajor,
        url: '/category',
        subNavigationItems: CATEGORIES.map((category) => ({
          label: category?.key,
          url: `/category?name=${category?.path}`,
        })),
      },
    ],
  },
];

function AppNavigation() {
  return (
    <Container>
      <nav className="Polaris-Navigation">
        <div className="Polaris-Navigation__PrimaryNavigation Polaris-Scrollable Polaris-Scrollable--vertical">
          {navList.map((section, index) => {
            const items = section.items;

            return (
              <ul key={index} className="Polaris-Navigation__Section" style={section?.separator ? { borderTop: 'var(--p-border-divider)' } : {}}>
                {section?.title && (
                  <li className="Polaris-Navigation__SectionHeading">
                    <span className="Polaris-Navigation__Text">{section?.title}</span>
                  </li>
                )}
                {items.map((item, index) => {
                  return <Item item={item} key={index} />;
                })}
              </ul>
            );
          })}
        </div>
      </nav>
    </Container>
  );
}

const Item = ({ item }) => {
  const [expand, setExpand] = useState(true);
  const router = useRouter();
  const subItems = item?.subNavigationItems;

  const handleToggleExpand = () => {
    if (!subItems?.length) return;
    setExpand((prev) => !prev);
  };

  return (
    <li className="Polaris-Navigation__ListItem">
      <div className="Polaris-Navigation__ItemInnerWrapper">
        <button
          type="button"
          className={`Polaris-Navigation__Item ${location.pathname === item?.url && 'Polaris-Navigation__Item--selected'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(item.url);
          }}
        >
          <div className="Polaris-Navigation__Icon">
            <Icon source={item?.icon} />
          </div>
          <span className="Polaris-Navigation__Text">{item?.label}</span>
        </button>
        {subItems?.length ? (
          <div onClick={handleToggleExpand} className={`toggleIcon ${expand ? 'expandIcon' : ''}`}>
            <Icon source={CaretDownMinor} />
          </div>
        ) : null}
      </div>
      {subItems?.length ? (
        <div className={`Polaris-Navigation__SecondaryNavigation ${expand ? 'Polaris-Navigation--isExpanded' : ''} `}>
          <ul className="Polaris-Navigation__List">
            {subItems.map((subItem, index) => {
              // console.log(`${location.pathname}${location.search}`÷, sub);
              return (
                <li
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(subItem.url);
                  }}
                  className="Polaris-Navigation__ListItem"
                >
                  <button
                    className={`Polaris-Navigation__Item ${
                      `${location.pathname}${location.search}` === subItem?.url && 'Polaris-Navigation__Item--selected'
                    } `}
                  >
                    <span className="Polaris-Navigation__Text">{subItem.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </li>
  );
};

export default AppNavigation;
