import CompareChart from '@components/CompareChart';
import TotalGrowthChart from '@components/TotalGrowthChart';
import { CATEGORIES, CHART_GROWTH_MAPPING } from '@constants/chart';
import themeMoveThemes from '@constants/themes';
import { FormLayout, Page, TextStyle } from '@shopify/polaris';
import { intersection } from 'lodash';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

function View() {
  const router = useRouter();

  const themeListSatisfied = useMemo(() => {
    const category = router.query?.name;
    const categoriesSelected = CATEGORIES.find((x) => x.path === (category ?? 'corporate')).value;
    return themeMoveThemes.filter((theme) => intersection(theme.category, categoriesSelected).length > 0);
  }, [router.query]);

  const categoryLabel = CATEGORIES.find((x) => x.path === (router.query?.name ?? 'corporate')).key;

  return (
    <Page fullWidth>
      <FormLayout>
        <TextStyle>
          Category: <TextStyle variation="strong">{categoryLabel}</TextStyle>{' '}
        </TextStyle>
        <TotalGrowthChart themeList={themeListSatisfied} mode={CHART_GROWTH_MAPPING.SALES.key} />
        <TotalGrowthChart themeList={themeListSatisfied} mode={CHART_GROWTH_MAPPING.REVIEWS.key} />
        <CompareChart themeList={themeListSatisfied} showLineChart={false} />
      </FormLayout>
    </Page>
  );
}

export default View;
