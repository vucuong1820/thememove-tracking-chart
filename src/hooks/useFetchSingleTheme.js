import { CHART_GROWTH_MAPPING } from '@constants/chart';
import getCompareDate from '@helpers/getCompareDate';
import getGrowthChartData from '@services/getGrowthChartData';
import { format } from 'date-fns';
import { useCallback } from 'react';

export default function useFetchSingleTheme(mode = CHART_GROWTH_MAPPING.SALES.key) {
  const getSalesOrReviewsPerDay = (item) => {
    return mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.salesPerDay ?? 0;
  };

  const getTotalSalesOrReviewsPerDay = useCallback(
    (items) => {
      let quantity = 0;
      items.forEach((item) => {
        quantity += mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item.salesPerDay;
      });
      return quantity;
    },
    [mode],
  );

  const fetchData = async (dates, themeId) => {
    if (!dates) return null;
    const result = await getGrowthChartData(dates, themeId);
    return result;
  };

  const handleFetchSingleTheme = async ({ dateSelected, dateCompared, theme }) => {
    const [selectedData, comparedData] = await Promise.all([
      fetchData(dateSelected, theme?.themeId),
      fetchData(dateCompared || getCompareDate(dateSelected), theme?.themeId),
    ]);
    let result = [];
    const selectedQty = getTotalSalesOrReviewsPerDay(selectedData.items);
    const comparedQty = getTotalSalesOrReviewsPerDay(comparedData.items);
    const listData = [selectedData, comparedData].filter((x) => x);
    for (let index = 0; index < listData.length; index++) {
      const data = listData[index];

      const dataList = data?.items?.map((item) => {
        const originValue = getSalesOrReviewsPerDay(item);

        return {
          key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
          value: originValue,
        };
      });

      result.push({
        data: dataList,
        name: index === 0 ? 'Selected' : 'Compared',
        isComparison: index === 1,
        // color: themeColor,
      });
    }

    // setTotalSelectedQty(selectedQty);
    const rate = ((selectedQty - comparedQty) / (comparedQty || 1)) * 100;
    // setGrowthRate(rate);

    const newSelectedDatasets = result?.[0] ?? {};
    let newComparedDatasets = result?.[1];
    newComparedDatasets = {
      ...newComparedDatasets,
      data: newComparedDatasets.data.slice(0, newSelectedDatasets?.data?.length),
    };

    // setSelectedDatasets([newSelectedDatasets, newComparedDatasets]);

    return {
      newThemeDatasets: [newSelectedDatasets, newComparedDatasets],
      newGrowthRate: rate,
      newTotalSelectedQty: selectedQty,
    };
  };

  return {
    handleFetchSingleTheme,
  };
}
