import { CHART_GROWTH_MAPPING } from '@constants/chart';
import getDateRange from '@helpers/getDateRange';
import getGrowthChartData from '@services/getGrowthChartData';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

export default function useTotalGrowthChart({ themeList, mode }) {
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTotalSalesOrReviewsAllTime = (item) => {
    return mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.totalReviews ?? 0 : item?.totalSales ?? 0;
  };

  useEffect(() => {
    setDatasets([]);
    setSelectedDatasets([]);
    handleFetch(selectedDate);
  }, [themeList]);

  const fetchData = async (dates, themeId) => {
    if (!dates) return null;
    const result = await getGrowthChartData(dates, themeId);
    return result;
  };

  const handleFetch = (dateSelected) => {
    for (const theme of themeList) {
      (async () => {
        const selectedData = await fetchData(dateSelected, theme.themeId);
        const smallestNumber = Math.min(...selectedData.items.map((item) => getTotalSalesOrReviewsAllTime(item)));
        const fixedValue = smallestNumber - (smallestNumber % 10);
        // console.log({ fixedValue, name: theme.name });
        const dataList = selectedData.items.map((item) => {
          const originValue = getTotalSalesOrReviewsAllTime(item);

          return {
            key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
            // value: originValue - fixedValue,
            value: originValue,
            originValue,
          };
        });

        const payload = {
          data: dataList,
          name: theme.name,
          color: theme.color,
        };

        setDatasets((prev) => {
          const cloneData = cloneDeep(prev);
          const indexChange = prev.findIndex((x) => x.name === theme.name);
          if (indexChange > -1) {
            cloneData[indexChange] = payload;
          } else cloneData.push(payload);

          return cloneData;
        });
      })();
    }
  };

  const handleSelectLegend = (item) => {
    setSelectedDatasets((prev) => {
      const index = prev.findIndex((data) => data?.name === item?.name);
      if (index !== -1) {
        const cloneData = cloneDeep(prev);
        cloneData.splice(index, 1);
        return cloneData;
      }
      return [...prev, item];
    });
  };

  const handleConfirm = async () => {
    try {
      handleFetch(selectedDate);
    } catch (error) {
      // showToast({
      //   error: true,
      //   message: error?.message,
      // });
    }
  };

  //   console.log(datasets);
  return { setSelectedDate, selectedDate, handleConfirm, datasets, handleSelectLegend, selectedDatasets };
}