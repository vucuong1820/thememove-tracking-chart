import formatStartEndDate from '@helpers/formatStartEndDate';
import axios from 'axios';

export default async function getCompareChartDataService(dates, themeList) {
  const formattedDate = formatStartEndDate(dates);
  const result = await axios.get(`/api/chart/list`, {
    params: {
      startingDay: formattedDate.start.toISOString(),
      endingDay: formattedDate.end.toISOString(),
      themeList: JSON.stringify(themeList),
    },
  });

  return result.data;
}
