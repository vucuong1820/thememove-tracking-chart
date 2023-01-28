import { TIME_ZONE } from '@constants';
import formatStartEndDate from '@helpers/formatStartEndDate';
import axios from 'axios';
import { utcToZonedTime } from 'date-fns-tz';

export default async function getThemeDataService(dates, themeId) {
  const formattedDate = formatStartEndDate(dates);
  const result = await axios.get(`/api/chart?`, {
    params: {
      startingDay: formattedDate.start.toISOString(),
      endingDay: formattedDate.end.toISOString(),
      themeId: themeId,
    },
  });

  const items = result.data.items.map((item) => ({
    ...item,
    createdAt: utcToZonedTime(item.createdAt, TIME_ZONE).toISOString(),
  }));

  return {
    ...result.data,
    items,
  };
}
