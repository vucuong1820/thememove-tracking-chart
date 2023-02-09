import { TIME_ZONE } from '@constants';
import formatStartEndDate from '@helpers/formatStartEndDate';
import axios from 'axios';
import { utcToZonedTime } from 'date-fns-tz';

export default async function getCompareChartDataService({ date, themeList, comparedDate }) {
  const formattedDate = formatStartEndDate(date);
  const formattedCompareDate = formatStartEndDate(comparedDate);
  const result = await axios.get(`/api/chart/list`, {
    params: {
      startingDay: formattedDate.start.toISOString(),
      endingDay: formattedDate.end.toISOString(),
      themeList: JSON.stringify(themeList),
      compareStart: formattedCompareDate.start.toISOString(),
      compareEnd: formattedCompareDate.end.toISOString(),
    },
  });

  const formattedData = Object.keys(result.data).reduce((res, state) => {
    const stateValue = result.data[state];
    res[state] = {};
    for (const theme in stateValue) {
      const themeValue = stateValue[theme];
      res[state][theme] = {
        ...stateValue[theme],
        items: themeValue.items.map((item) => ({ ...item, createdAt: utcToZonedTime(item.createdAt, TIME_ZONE).toISOString() })),
      };
    }
    return res;
  }, {});

  return formattedData;
}
