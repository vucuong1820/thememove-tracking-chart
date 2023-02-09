import { CHART_GROWTH_MAPPING } from '@constants/chart';
import getCompareDate from '@helpers/getCompareDate';
import getDateRange from '@helpers/getDateRange';
import getGrowthChartData from '@services/getGrowthChartData';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import useFetchSingleTheme from 'src/hooks/useFetchSingleTheme';

export const FIXED_REVIEW_VALUE = 1;

export default function useTotalGrowthChart({ themeList, mode }) {
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [comparedDate, setComparedDate] = useState(getCompareDate(getDateRange('this_week')));
  const [datasets, setDatasets] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [growthRate, setGrowthRate] = useState();
  const [totalSelectedQty, setTotalSelectedQty] = useState(0);
  const { handleFetchSingleTheme } = useFetchSingleTheme(mode);

  const getSalesOrReviewsPerDay = (item) => {
    return mode === CHART_GROWTH_MAPPING.REVIEWS.key ? item?.reviewsPerDay ?? 0 : item?.salesPerDay ?? 0;
  };

  useEffect(() => {
    (async () => {
      setDatasets([]);
      setSelectedDatasets([]);
      setLoading(true);
      await handleFetch(selectedDate);
      setLoading(false);
    })();
  }, [themeList]);

  useEffect(() => {
    setComparedDate(getCompareDate(selectedDate));
  }, [selectedDate]);

  const fetchData = async (dates, themeId) => {
    if (!dates) return null;
    const result = await getGrowthChartData(dates, themeId);
    return result;
  };

  const handleFetch = async (dateSelected) => {
    let promise = [];
    for (const theme of themeList) {
      promise.push(
        (async () => {
          const selectedData = await fetchData(dateSelected, theme.themeId);
          const dataList = selectedData.items.map((item) => {
            const originValue = getSalesOrReviewsPerDay(item);

            return {
              key: format(new Date(item?.createdAt), 'MM/dd/yyyy'),
              value: originValue,
              originValue,
            };
          });

          const payload = {
            data: dataList,
            name: theme.name,
            color: theme.color,
            total: mode === CHART_GROWTH_MAPPING.REVIEWS.key ? selectedData?.totalReviews ?? 0 : selectedData?.totalSales ?? 0,
            detail: theme,
          };

          setDatasets((prev) => {
            const cloneData = cloneDeep(prev);
            const indexChange = prev.findIndex((x) => x.name === theme.name);
            if (indexChange > -1) {
              cloneData[indexChange] = payload;
            } else cloneData.push(payload);

            return cloneData;
          });
        })(),
      );
    }
    await Promise.allSettled(promise);
  };

  const handleSelectLegend = async (item) => {
    const index = selectedThemes.findIndex((data) => data?.themeId === item?.detail?.themeId);
    let newSelectedThemes;
    if (index !== -1) {
      newSelectedThemes = cloneDeep(selectedThemes);
      newSelectedThemes.splice(index, 1);
    } else {
      newSelectedThemes = [...selectedThemes, item?.detail];
    }

    setSelectedThemes(newSelectedThemes);

    if (newSelectedThemes?.length === 1) {
      setLoading(true);
      const { newThemeDatasets, newGrowthRate, newTotalSelectedQty } = await handleFetchSingleTheme({
        dateSelected: selectedDate,
        dateCompared: comparedDate,
        theme: newSelectedThemes?.[0],
      });
      setSelectedDatasets(newThemeDatasets);
      setGrowthRate(newGrowthRate);
      setTotalSelectedQty(newTotalSelectedQty);

      setLoading(false);
    } else {
      setSelectedDatasets(() => {
        const newSelectedDatasets = datasets.filter((data) => newSelectedThemes.map((x) => x.name).includes(data?.name));
        return newSelectedDatasets;
      });
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (selectedThemes?.length === 1) {
        const { newThemeDatasets, newGrowthRate, newTotalSelectedQty } = await handleFetchSingleTheme({
          dateSelected: selectedDate,
          dateCompared: comparedDate,
          theme: selectedThemes?.[0],
        });
        setSelectedDatasets(newThemeDatasets);
        setGrowthRate(newGrowthRate);
        setTotalSelectedQty(newTotalSelectedQty);
      } else {
        await handleFetch(selectedDate);
      }
      setLoading(false);
    } catch (error) {
      // showToast({
      //   error: true,
      //   message: error?.message,
      // });
    }
  };
  return {
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
  };
}
