import CompareChart from '@components/CompareChart';
import GrowthChart from '@components/GrowthChart';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import { Page } from '@shopify/polaris';

function View() {
  return (
    <Page fullWidth>
      <GrowthChart mode={CHART_GROWTH_MAPPING.SALES.key} />
      <GrowthChart mode={CHART_GROWTH_MAPPING.REVIEWS.key} />
      <CompareChart />
    </Page>
  );
}

export default View;
