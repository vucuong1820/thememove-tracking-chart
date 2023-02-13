import DateSelector from '@components/DateSelector';
import Loading from '@components/layouts/Loading';
import PolarisLineChart from '@components/layouts/PolarisLineChart';
import LegendItem from '@components/LegendItem';
import TooltipList from '@components/TooltipList';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import themeMoveThemes from '@constants/themes';
import { Card, DisplayText, EmptyState, Heading, Icon, SkeletonThumbnail, Stack, TextStyle } from '@shopify/polaris';
import { ArrowDownMinor, ArrowUpMinor } from '@shopify/polaris-icons';
import { capitalize, cloneDeep } from 'lodash';
import { useMemo } from 'react';
import useTotalGrowthChart from './useTotalGrowthChart';

function TotalGrowthChart({ themeList = themeMoveThemes, mode = CHART_GROWTH_MAPPING.SALES.key }) {
  const {
    totalSelectedQty,
    growthRate,
    selectedThemes,
    comparedDate,
    setComparedDate,
    loading,
    setSelectedThemes,
    setSelectedDate,
    selectedDate,
    handleConfirm,
    datasets,
    handleSelectLegend,
    selectedDatasets,
  } = useTotalGrowthChart({
    themeList,
    mode,
  });

  const totalTracking = useMemo(() => {
    let dataList = datasets;
    if (selectedThemes?.length) {
      dataList = datasets.filter((data) => selectedThemes.map((x) => x.name).includes(data?.name));
    }
    return dataList.reduce((res, data) => {
      res += data?.total;
      return res;
    }, 0);
  }, [datasets, selectedThemes]);

  const renderTooltip = (data) => {
    return <TooltipList data={data} selectedThemes={selectedThemes} />;
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
        { content: 'Show all themes', size: 'slim', disabled: loading || !selectedThemes?.length, onAction: () => setSelectedThemes([]) },
      ]}
    >
      <Card.Section>
        <Stack>
          <Stack.Item fill>
            <Stack alignment="center">
              <Stack.Item fill>
                <Stack vertical>
                  <Stack.Item>
                    <Heading>{capitalize(CHART_GROWTH_MAPPING[mode].key)} growth</Heading>
                  </Stack.Item>
                  <Stack.Item>
                    {selectedThemes?.length === 1 &&
                      (loading ? (
                        <SkeletonThumbnail />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                          <DisplayText>{totalSelectedQty}</DisplayText>

                          {growthRate ? (
                            <div
                              style={{
                                paddingLeft: 15,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Icon color={growthRate > 0 ? 'success' : 'critical'} source={growthRate > 0 ? ArrowUpMinor : ArrowDownMinor} />
                              <span style={{ fontSize: '2rem' }}>
                                <TextStyle variation={growthRate > 0 ? 'positive' : 'negative'}>{growthRate.toFixed(2)}%</TextStyle>
                              </span>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      ))}
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <div style={{ paddingRight: 30, display: 'flex' }}>
              <div style={{ marginRight: 'var(--p-space-6)' }}>
                {loading ? (
                  <SkeletonThumbnail />
                ) : (
                  <>
                    <Heading>{totalTracking?.toLocaleString('en-US')}</Heading>
                    <TextStyle variation="subdued">{CHART_GROWTH_MAPPING?.[mode]?.total}</TextStyle>
                  </>
                )}
              </div>
              <DateSelector
                comparedDate={comparedDate}
                onChangeComparedDate={setComparedDate}
                onlyDefault={selectedThemes?.length !== 1}
                onConfirm={handleConfirm}
                selectedDate={selectedDate}
                onChangeSelectedDate={setSelectedDate}
              />
            </div>
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
              data={selectedThemes?.length ? selectedDatasets : datasets}
              isAnimated
              skipLinkText="Skip chart content"
              theme="Light"
              tooltipOptions={{
                renderTooltipContent: renderTooltip,
              }}
              yAxisOptions={{
                labelFormatter: (value) => {
                  const condition = Number.isInteger(value);
                  return condition ? value?.toString() ?? '' : '';
                },
              }}
              showLegend={true}
              renderLegendContent={({ getColorVisionStyles, getColorVisionEventAttrs }) => {
                if (loading) return themeList.map((x, index) => <LegendItem key={index} />);
                return cloneDeep(datasets)
                  .sort((a, b) => a?.name?.localeCompare(b?.name))
                  .map((item) => {
                    return (
                      <LegendItem
                        onSelect={() => handleSelectLegend(item)}
                        key={item?.name}
                        data={item}
                        styles={getColorVisionStyles()}
                        attributes={getColorVisionEventAttrs()}
                        selected={selectedThemes.findIndex((data) => data?.name === item?.name) !== -1}
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
