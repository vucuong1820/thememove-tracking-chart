import getCompareDate from '@helpers/getCompareDate';
import getDateRange from '@helpers/getDateRange';
import getCompareChartDataService from '@services/getCompareChartDataService';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import useFetchSingleTheme from 'src/hooks/useFetchSingleTheme';
import { useNotificationStore } from 'src/providers/NotificationProvider';

export default function useCompareChart({ themeList }) {
  const [datasets, setDatasets] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [comparedDate, setComparedDate] = useState(getCompareDate(getDateRange('this_week')));
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [growthRate, setGrowthRate] = useState();
  const [totalSelectedQty, setTotalSelectedQty] = useState(0);
  const cacheDate = useRef();
  const { showToast } = useNotificationStore();

  useEffect(() => {
    if (selectedThemes?.length !== 1) {
      cacheDate.current = selectedDate;
    }
  }, [selectedDate]);

  const { handleFetchSingleTheme } = useFetchSingleTheme();

  const handleChangeDate = (newSelectedDate) => {
    if (newSelectedDate) setSelectedDate(newSelectedDate);
  };

  useEffect(() => {
    setComparedDate(getCompareDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setSelectedThemes([]);
      await handleChange();
      setLoading(false);
    })();
  }, [themeList]);

  const handleChange = async () => {
    try {
      setSelectedDatasets([]);
      const { selected, compared } = await getCompareChartDataService({
        date: selectedDate,
        comparedDate: comparedDate || getCompareDate(selectedDate),
        themeList,
      });
      let newDatasets = [];
      let newRows = [];
      for (const themeName in selected) {
        const { items, totalSales, totalReviews } = selected[themeName];
        const themeDetail = themeList.find((x) => x.name === themeName);
        const data = items.map((themeItem) => ({ key: format(new Date(themeItem?.createdAt), 'MM/dd/yyyy'), value: themeItem?.salesPerDay }));
        newDatasets.push({
          name: themeName,
          data,
          color: themeDetail?.color,
          total: totalSales,
        });
        newRows.push(formatThemeRow({ items, totalSales, totalReviews, compared: compared[themeName] }));
      }
      setDatasets(newDatasets);

      setRows(newRows);
    } catch (error) {
      showToast({
        error: true,
        message: error?.message,
      });
    }
  };

  const formatThemeRow = ({ items, totalSales, totalReviews, compared }) => {
    const { items: comparedItems } = compared;
    let sales = 0;
    let rating = 5;
    let reviews = 0;
    for (const item of items) {
      sales += item?.salesPerDay;
      rating = item?.rating;
      reviews += item?.reviewsPerDay;
    }

    let comparedSales = 0;
    let comparedReviews = 0;
    for (const item of comparedItems) {
      comparedSales += item?.salesPerDay;
      comparedReviews += item?.reviewsPerDay;
    }

    return [
      items?.[0]?.name,
      totalSales,
      {
        value: sales,
        percentage: Number.parseFloat((((sales - comparedSales) / (comparedSales || 1)) * 100).toFixed(1)),
      },
      totalReviews,
      {
        value: reviews,
        percentage: Number.parseFloat((((reviews - comparedReviews) / (comparedReviews || 1)) * 100).toFixed(1)),
      },
      rating,
    ];
  };

  const handleSelectLegend = async (item) => {
    const newItem = themeList.find((x) => x?.name === item?.name);
    const index = selectedThemes.findIndex((data) => data?.name === item?.name);
    let newSelectedThemes;

    if (index !== -1) {
      newSelectedThemes = cloneDeep(selectedThemes);
      newSelectedThemes.splice(index, 1);
    } else {
      newSelectedThemes = [...selectedThemes, newItem];
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
      if (cacheDate.current) setSelectedDate(cacheDate.current);
      setSelectedDatasets(() => {
        const newSelectedDatasets = datasets.filter((data) => newSelectedThemes.map((x) => x.name).includes(data?.name));
        return newSelectedDatasets;
      });
    }
  };

  const handleConfirm = async () => {
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
      await handleChange(selectedDate);
    }
    setLoading(false);
  };

  return {
    selectedThemes,
    handleConfirm,
    handleChangeDate,
    selectedDate,
    loading,
    rows: Array.from(rows).sort((a, b) => Number.parseFloat(b[2]) - Number.parseFloat(a[2])),
    datasets,
    selectedDatasets,
    handleSelectLegend,
    totalSelectedQty,
    growthRate,
    comparedDate,
    setComparedDate,
    setSelectedDate,
  };
}
