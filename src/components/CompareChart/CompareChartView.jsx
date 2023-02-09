import DateSelector from '@components/DateSelector';
import Loading from '@components/layouts/Loading';
import PolarisLineChart from '@components/layouts/PolarisLineChart';
import LegendItem from '@components/LegendItem';
import TooltipList from '@components/TooltipList';
import themeMoveThemes from '@constants/themes';
import { Card, DisplayText, Heading, Icon, SkeletonThumbnail, Stack, TextStyle } from '@shopify/polaris';
import { ArrowDownMinor, ArrowUpMinor } from '@shopify/polaris-icons';
import { cloneDeep, isNil } from 'lodash';
import { useMemo } from 'react';
import CompareTable from './CompareTable';
import useCompareChart from './useCompareChart';

function CompareChart({ showTable = true, showLineChart = true, themeList = themeMoveThemes }) {
  const {
    comparedDate,
    setComparedDate,
    setSelectedDate,
    totalSelectedQty,
    growthRate,
    selectedThemes,
    handleConfirm,
    selectedDate,
    loading,
    rows,
    datasets,
    selectedDatasets,
    handleSelectLegend,
  } = useCompareChart({
    themeList,
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
  return (
    <Card>
      <Card.Header
        title={
          <Stack>
            <Stack.Item fill>
              <Stack vertical>
                <Stack.Item>
                  <Heading variation="strong">Sales comparison</Heading>
                </Stack.Item>
                <Stack.Item>
                  {selectedThemes?.length === 1 &&
                    (loading ? (
                      <SkeletonThumbnail />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                        <DisplayText>{totalSelectedQty}</DisplayText>

                        {isNil(growthRate) ? (
                          ''
                        ) : (
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
                        )}
                      </div>
                    ))}
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
                      <Heading>{totalTracking}</Heading>
                      <TextStyle variation="subdued">All time sales</TextStyle>
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
        }
      >
        {/* <Button onClick={handleClick} plain>
          Post to Slack
        </Button> */}
      </Card.Header>
      {showTable && <CompareTable rows={rows} loading={loading} />}
      {showLineChart && (
        <Card.Section subdued>
          <div style={{ height: '500px', position: 'relative' }}>
            {loading && <Loading.Center size="large" />}
            {datasets?.length > 0 && (
              <PolarisLineChart
                data={selectedThemes?.length ? selectedDatasets : datasets}
                isAnimated
                theme="Light"
                tooltipOptions={{
                  renderTooltipContent: renderTooltip,
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
      )}
    </Card>
  );
}
export default CompareChart;
