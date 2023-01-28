/* eslint-disable no-console */

import themeShop from '@constants/themes';
import getDateRange from '@helpers/getDateRange';
import getCompareChartDataService from '@services/getCompareChartDataService';
import getThemeDataService from '@services/getThemeDataService';
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
  //   const { showToast } = useNotificationStore();
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
    const groups = await getCompareChartDataService(selectedDate, themeList);
    let newDatasets = [];
    let newRows = [];
    console.log(groups);
    for (const themeName in groups) {
      const { items } = groups[themeName];
      const themeDetail = themeList.find((x) => x.name === themeName);
      const data = items.map((themeItem) => ({ key: format(new Date(themeItem?.createdAt), 'MM/dd/yyyy'), value: themeItem?.salesPerDay }));
      newDatasets.push({
        name: themeName,
        data,
        color: themeDetail?.color,
      });
      newRows.push(formatThemeRow({ items, detail: themeDetail }));
    }
    setDatasets(newDatasets);

    setRows(newRows);
  };

  const formatThemeRow = ({ items, detail }) => {
    let sales = 0;
    let rating = 5;
    let reviews = 0;
    let totalSales = 0;
    for (const item of items) {
      sales += item?.salesPerDay;
      rating = item?.rating;
      reviews += item?.reviewsPerDay;
      totalSales = item?.totalSales;
    }

    return [
      <TextStyle key={1} variation={detail?.priority ? 'strong' : ''}>
        {items?.[0]?.name}
      </TextStyle>,
      totalSales?.toLocaleString('en-US'),
      sales,
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
    // handleChange: () => {},
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
