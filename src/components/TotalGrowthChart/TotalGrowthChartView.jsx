import { TooltipContainer } from '@components/chart.styles';
import DateSelector from '@components/DateSelector';
import Loading from '@components/layouts/Loading';
import PolarisLineChart from '@components/layouts/PolarisLineChart';
import LegendItem from '@components/LegendItem';
import TooltipItem from '@components/TooltipItem';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import themeMoveThemes from '@constants/themes';
import { Card, EmptyState, FormLayout, Heading, Stack, TextContainer } from '@shopify/polaris';
import { capitalize, cloneDeep } from 'lodash';
import { useMemo } from 'react';
import useTotalGrowthChart, { FIXED_REVIEW_VALUE } from './useTotalGrowthChart';

function TotalGrowthChart({ themeList = themeMoveThemes, mode = CHART_GROWTH_MAPPING.SALES.key }) {
  const { loading, setSelectedDatasets, setSelectedDate, selectedDate, handleConfirm, datasets, handleSelectLegend, selectedDatasets } =
    useTotalGrowthChart({
      themeList,
      mode,
    });

  const fixedValue = useMemo(() => {
    if (mode === CHART_GROWTH_MAPPING.REVIEWS.key) return FIXED_REVIEW_VALUE;
    const smallest = Math.min(...(datasets?.[0]?.data?.map((item) => item.originValue) ?? []));
    return smallest - (smallest % 10);
  }, [datasets]);

  const renderTooltip = (data) => {
    const sortedData = cloneDeep(data.data[0].data.sort((a, b) => b.value - a.value));
    return (
      <TooltipContainer>
        <FormLayout>
          <Heading>{data.title}</Heading>
          <Stack vertical spacing="tight">
            {sortedData.map((item, index) => {
              return <TooltipItem data={item} key={index} />;
            })}
          </Stack>
        </FormLayout>
      </TooltipContainer>
    );
  };

  if (!themeList?.length)
    return (
      <Card sectioned>
        <EmptyState heading="No tracking theme found">
          <p>Please select another option or try again later.</p>
        </EmptyState>
      </Card>
    );

  return (
    <Card
      secondaryFooterActions={[
        { content: 'Show all themes', size: 'slim', disabled: loading || !selectedDatasets?.length, onAction: () => setSelectedDatasets([]) },
      ]}
    >
      <Card.Section>
        <Stack>
          <Stack.Item fill>
            <TextContainer>
              <Stack alignment="center">
                <Stack.Item>
                  <Heading>{capitalize(CHART_GROWTH_MAPPING[mode].key)} growth</Heading>
                </Stack.Item>
              </Stack>
              <DateSelector onlyDefault={true} onConfirm={handleConfirm} selectedDate={selectedDate} onChangeSelectedDate={setSelectedDate} />
            </TextContainer>
          </Stack.Item>
        </Stack>
      </Card.Section>
      <Card.Section>
        <div
          style={{
            height: '500px',
            position: 'relative',
          }}
        >
          {loading && <Loading.Center size="large" />}

          {datasets?.length > 0 && (
            <PolarisLineChart
              data={selectedDatasets?.length ? selectedDatasets : datasets}
              isAnimated
              skipLinkText="Skip chart content"
              theme="Light"
              tooltipOptions={{
                renderTooltipContent: renderTooltip,
              }}
              // yAxisOptions={{
              //   labelFormatter: (value) => {
              //     if (mode === CHART_GROWTH_MAPPING.REVIEWS.key) {
              //       const newValue = value - fixedValue;
              //       const condition = Number.isInteger(newValue) && newValue >= 0;
              //       return condition ? newValue?.toString() ?? '' : '';
              //     }
              //     return (value + fixedValue)?.toString() ?? '';
              //   },
              // }}
              showLegend={true}
              renderLegendContent={({ getColorVisionStyles, getColorVisionEventAttrs }) => {
                if (loading) return themeList.map((x, index) => <LegendItem key={index} />);
                return datasets.map((item) => {
                  return (
                    <LegendItem
                      onSelect={() => handleSelectLegend(item)}
                      key={item?.name}
                      data={item}
                      styles={getColorVisionStyles()}
                      attributes={getColorVisionEventAttrs()}
                      selected={selectedDatasets.findIndex((data) => data?.name === item?.name) !== -1}
                    />
                  );
                });
              }}
            />
          )}
        </div>
      </Card.Section>
    </Card>
  );
}

export default TotalGrowthChart;
