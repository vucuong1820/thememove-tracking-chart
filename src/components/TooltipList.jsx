import { FormLayout, Heading, Icon, Stack, TextStyle } from '@shopify/polaris';
import { ArrowDownMinor, ArrowUpMinor } from '@shopify/polaris-icons';
import { cloneDeep } from 'lodash';
import { TooltipContainer } from './chart.styles';
import TooltipItem from './TooltipItem';

const TooltipList = ({ data, selectedThemes }) => {
  if (selectedThemes?.length === 1) {
    const activeIndex = data?.activeIndex;
    const selectedValue = data?.dataSeries?.[0]?.data[activeIndex]?.value;
    const comparedValue = data?.dataSeries?.[1]?.data[activeIndex]?.value;
    let percentage = 0;
    if (selectedValue && comparedValue) {
      percentage = (((selectedValue - comparedValue) / comparedValue) * 100)?.toFixed(0) ?? 0;
    }
    return (
      <TooltipContainer>
        <FormLayout>
          <Heading>{selectedThemes?.[0]?.name}</Heading>

          <Stack vertical spacing="tight">
            {data.dataSeries.map((item, index) => {
              const info = item.data[activeIndex];
              const indexColor = data?.data?.[0]?.data?.length === 1 ? 0 : index;
              const color = data?.data?.[0]?.data?.[indexColor]?.color;
              return info && <TooltipItem data={{ ...info, color, value: info?.originValue ?? info?.value }} key={index} />;
            })}
            {percentage && (
              <Stack.Item>
                <div className="Tooltip__Percentage">
                  <Icon color={percentage > 0 ? 'success' : 'critical'} source={percentage > 0 ? ArrowUpMinor : ArrowDownMinor} />
                  <TextStyle variation={percentage > 0 ? 'positive' : 'negative'}>{`${percentage > 0 ? '+' : ''}${percentage}%`}</TextStyle>
                </div>
              </Stack.Item>
            )}
          </Stack>
        </FormLayout>
      </TooltipContainer>
    );
  }

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

export default TooltipList;
