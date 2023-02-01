/* eslint-disable no-console */

import getDateRange from '@helpers/getDateRange';
import getCompareChartDataService from '@services/getCompareChartDataService';
import { TextStyle } from '@shopify/polaris';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

export default function useCompareChart({ themeList }) {
  const [datasets, setDatasets] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getDateRange('this_week'));
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const handleChangeDate = (newSelectedDate) => {
    if (newSelectedDate) setSelectedDate(newSelectedDate);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await handleChange();
      setLoading(false);
    })();
  }, [themeList]);

  const handleChange = async () => {
    setSelectedDatasets([]);
    const groups = await getCompareChartDataService(selectedDate, themeList);
    let newDatasets = [];
    let newRows = [];
    for (const themeName in groups) {
      const { items, totalSales, totalReviews } = groups[themeName];
      const themeDetail = themeList.find((x) => x.name === themeName);
      const data = items.map((themeItem) => ({ key: format(new Date(themeItem?.createdAt), 'MM/dd/yyyy'), value: themeItem?.salesPerDay }));
      newDatasets.push({
        name: themeName,
        data,
        color: themeDetail?.color,
      });
      newRows.push(formatThemeRow({ items, detail: themeDetail, totalSales, totalReviews }));
    }
    setDatasets(newDatasets);

    setRows(newRows);
  };

  const formatThemeRow = ({ items, detail, totalSales, totalReviews }) => {
    let sales = 0;
    let rating = 5;
    let reviews = 0;
    for (const item of items) {
      sales += item?.salesPerDay;
      rating = item?.rating;
      reviews += item?.reviewsPerDay;
    }

    return [
      <TextStyle key={1} variation={detail?.priority ? 'strong' : ''}>
        {items?.[0]?.name}
      </TextStyle>,
      totalSales?.toLocaleString('en-US'),
      sales,
      totalReviews,
      reviews,
      rating,
    ];
  };

  const handleClick = () => {
    // sendAlert(rows);
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

  return {
    handleChange,
    handleChangeDate,
    selectedDate,
    loading,
    handleClick,
    rows: Array.from(rows).sort((a, b) => Number.parseFloat(b[2]) - Number.parseFloat(a[2])),
    datasets,
    selectedDatasets,
    handleSelectLegend,
  };
}
