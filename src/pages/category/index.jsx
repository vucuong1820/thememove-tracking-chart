import GrowthChart from '@components/GrowthChart';
import TotalGrowthChart from '@components/TotalGrowthChart';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import themeMoveThemes from '@constants/themes';
import { ActionList, Button, FormLayout, Page, Popover, TextStyle } from '@shopify/polaris';
import { intersection } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

const categories = [
  {
    key: 'Corporate/ Business',
    value: ['Corporate', 'Business'],
  },
  {
    key: 'Creative/ Portfolio',
    value: ['Creative', 'Portfolio'],
  },
  {
    key: 'eCommerce/ WooCommerce',
    value: ['eCommerce', 'WooCommerce'],
  },
  {
    key: 'Education',
    value: ['Education'],
  },
  {
    key: 'Entertainment/ Film & TV',
    value: ['Entertainment', 'Film & TV'],
  },
  {
    key: 'Blog/ Magazine/ Personal',
    value: ['Blog', 'Magazine', 'Personal'],
  },
];
function View() {
  const [popoverActive, setPopoverActive] = useState(false);
  const [selected, setSelected] = useState('Corporate/ Business');

  const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      {selected}
    </Button>
  );

  const themeListSatisfied = useMemo(() => {
    const categoriesSelected = categories.find((x) => x.key === selected).value;
    return themeMoveThemes.filter((theme) => intersection(theme.category, categoriesSelected).length > 0);
  }, [selected]);

  const categoryList = categories.map((category) => ({
    content: category.key,
    onAction: () => {
      setSelected(category.key);
      togglePopoverActive();
    },
    active: category.key === selected,
  }));

  return (
    <Page fullWidth>
      <FormLayout>
        <TextStyle variation="strong">Choose category</TextStyle>
        <Popover active={popoverActive} activator={activator} onClose={togglePopoverActive}>
          <ActionList actionRole="menuitem" items={categoryList} />
        </Popover>
        <TotalGrowthChart themeList={themeListSatisfied} mode={CHART_GROWTH_MAPPING.SALES.key} />
        <TotalGrowthChart themeList={themeListSatisfied} mode={CHART_GROWTH_MAPPING.REVIEWS.key} />
      </FormLayout>
    </Page>
  );
}

export default View;
