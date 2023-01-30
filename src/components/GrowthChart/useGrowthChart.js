import { MINIMOG_THEME_ID } from '@constants';
import { CHART_GROWTH_MAPPING } from '@constants/chart';
import themeShop from '@constants/themes';
import getCompareDate from '@helpers/getCompareDate';
import getDateRange from '@helpers/getDateRange';
import getGrowthChartData from '@services/getGrowthChartData';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

const minimog = themeShop.find((theme) => theme.themeId === MINIMOG_THEME_ID);
export const FIXED_REVIEW_VALUE = 1;

export default function useGrowthChart({ mode, themeList }) {
  const [total, setTotal] = useState(0);
  const [growthRate, setGrowthRate] = useState();
  const [rating, setRating] = useState(5.0);
  const [totalSelectedQty, setTotalSelectedQty] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [comparedDate, setComparedDate] = useState(getCompareDate(getDateRange('this_week')));
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

  const compare = useMemo(() => selectedDate && comparedDate, [selectedDate, comparedDate]);

  useEffect(() => {
    (async () => {
      if (selectedDate) {
        try {
          setLoading(true);
          await getDatasets({ dateSelected: selectedDate, dateCompared: comparedDate, compare });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          // showToast({
          //   error: true,
          //   message: error?.message,
          // });
        }
      }
    })();
  }, []);

  useEffect(() => {
    setComparedDate(getCompareDate(selectedDate));
  }, [selectedDate]);

  const fetchData = async (dates) => {
    if (!dates) return null;
    const result = await getGrowthChartData(dates, minimog.themeId);
    if (result) {
      setTotal(mode === CHART_GROWTH_MAPPING.REVIEWS.key ? result?.totalReviews : result?.totalSales);
    }
    return result;
  };

  const getTotalSalesOrReviewsAllTime = (item) => {
    return mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewQuantity ?? 0 : item?.totalSales ?? 0;
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

  const getDatasets = async ({ dateSelected, dateCompared }) => {
    const [selectedData, comparedData] = await Promise.all([fetchData(dateSelected), fetchData(dateCompared || getCompareDate(dateSelected))]);
    setRating(selectedData.items[selectedData.items.length - 1]?.rating);
    let result = [];
    const selectedQty = getTotalSalesOrReviewsPerDay(selectedData.items);
    const comparedQty = getTotalSalesOrReviewsPerDay(comparedData.items);
    const listData = [selectedData, comparedData].filter((x) => x);
    if (!dateCompared) {
      const data = listData[0];

      const smallestNumber = Math.min(...data.items.map((item) => getTotalSalesOrReviewsAllTime(item)));
      const fixedValue = smallestNumber - (smallestNumber % 10);

      const dataList = data.items.map((item) => {
        const originValue = getTotalSalesOrReviewsAllTime(item);

        return {
          key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
          value: originValue - fixedValue,
          originValue,
        };
      });

      result.push({
        data: dataList,
        name: 'Selected',
        color: minimog.color,
      });
    } else {
      for (let index = 0; index < listData.length; index++) {
        const data = listData[index];

        const dataList = data?.items?.map((item) => {
          const originValue = mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.salesPerDay ?? 0;

          return {
            key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
            value: mode === CHART_GROWTH_MAPPING.REVIEWS.key ? originValue + FIXED_REVIEW_VALUE : originValue,
            originValue,
          };
        });

        result.push({
          data: dataList,
          name: index === 0 ? 'Selected' : 'Compared',
          isComparison: index === 1,
          color: minimog.color,
        });
      }
    }

    setTotalSelectedQty(selectedQty);
    const rate = ((selectedQty - comparedQty) / (comparedQty || 1)) * 100;
    setGrowthRate(rate);

    const newSelectedDatasets = result?.[0] ?? {};
    let newComparedDatasets = result?.[1];
    if (!newComparedDatasets) {
      setDatasets(result);
      return;
    }
    newComparedDatasets = {
      ...newComparedDatasets,
      data: newComparedDatasets.data.slice(0, newSelectedDatasets?.data?.length),
    };

    setDatasets([newSelectedDatasets, newComparedDatasets]);
  };
  const handleConfirm = async () => {
    try {
      setLoading(true);
      await getDatasets({ dateSelected: selectedDate, dateCompared: comparedDate, compare });
      setLoading(false);
    } catch (error) {
      // showToast({
      //   error: true,
      //   message: error?.message,
      // });
      setLoading(false);
    }
  };

  return {
    compare,
    handleConfirm,
    selectedDate,
    comparedDate,
    setSelectedDate,
    setComparedDate,
    total,
    growthRate,
    rating,
    totalSelectedQty,
    loading,
    datasets,
  };
}
