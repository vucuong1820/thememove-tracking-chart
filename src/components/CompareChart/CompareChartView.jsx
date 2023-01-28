import { TooltipContainer } from '@components/chart.styles';
import DateSelector from '@components/DateSelector';
import PolarisLineChart from '@components/layouts/PolarisLineChart';
import Table from '@components/layouts/Table';
import LegendItem from '@components/LegendItem';
import TooltipItem from '@components/TooltipItem';
import themeMoveThemes from '@constants/themes';
import { Button, Card, FormLayout, Heading, Stack } from '@shopify/polaris';
import { cloneDeep } from 'lodash';
import CompareTable from './CompareTable';
import useCompareChart from './useCompareChart';

function CompareChart({ showLineChart, themeList = themeMoveThemes }) {
  const { handleSelectLegend, selectedDatasets, handleChange, handleChangeDate, selectedDate, handleClick, loading, rows, datasets } =
    useCompareChart({ themeList });

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
  // console.log(datasets, rows);

  return (
    <Card>
      <Card.Header
        title={
          <Stack vertical>
            <Stack.Item>
              <Heading variation="strong">Sales comparison</Heading>
            </Stack.Item>
            <Stack.Item>
              <DateSelector onConfirm={handleChange} onlyDefault={true} selectedDate={selectedDate} onChangeSelectedDate={handleChangeDate} />
            </Stack.Item>
          </Stack>
        }
      >
        <Button onClick={handleClick} plain>
          Post to Slack
        </Button>
      </Card.Header>
      <CompareTable rows={rows} loading={loading} />
      {showLineChart && (
        <Card.Section subdued>
          <div style={{ height: '500px', position: 'relative' }}>
            {datasets?.length > 0 && (
              <PolarisLineChart
                data={selectedDatasets?.length ? selectedDatasets : datasets}
                isAnimated
                theme="Light"
                tooltipOptions={{
                  renderTooltipContent: renderTooltip,
                }}
                showLegend={true}
                renderLegendContent={({ getColorVisionStyles, getColorVisionEventAttrs }) => {
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
      )}
    </Card>
  );
}
export default CompareChart;
