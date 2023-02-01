import CompareChart from '@components/CompareChart';
import TotalGrowthChart from '@components/TotalGrowthChart';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import { Page } from '@shopify/polaris';

function View() {
  return (
    <Page fullWidth>
      <TotalGrowthChart mode={CHART_GROWTH_MAPPING.SALES.key} />
      <TotalGrowthChart mode={CHART_GROWTH_MAPPING.REVIEWS.key} />
      <CompareChart />
    </Page>
  );
}

export default View;
