/* eslint-disable no-useless-escape */
import connectMongo from '@configs/connectMongo';
import { TIME_ZONE } from '@constants';
import themeMoveThemes from '@constants/themes';
import Theme from '@models/Theme';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { cloneDeep, groupBy } from 'lodash';

connectMongo();

export default async function handler(req, res) {
  try {
    const { startingDay, endingDay, themeList } = req.query;

    const themes = themeList ? JSON.parse(themeList) : themeMoveThemes;
    const filters = {
      createdAt: {
        $gte: startingDay,
        $lte: endingDay,
      },
      name: {
        $in: themes.map((theme) => theme.name),
      },
    };

    const response = await Theme.find(filters);

    const currentDate = new Date();
    const dayStart = zonedTimeToUtc(startOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString();
    const dayEnd = zonedTimeToUtc(endOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString();

    const currentTotalSalesList = await Theme.find({
      createdAt: {
        $gte: dayStart,
        $lte: dayEnd,
      },
      name: {
        $in: themes.map((theme) => theme.name),
      },
    }).select('totalSales totalReviews themeId');

    const responseGroupByName = groupBy(cloneDeep(response), 'name');

    let groups = {};
    for (const themeName of Object.keys(responseGroupByName)) {
      let totalSales;
      let totalReviews;
      const theme = themes.find((theme) => theme.name === themeName);
      if (theme) {
        const { themeId } = theme;
        const themeDetails = currentTotalSalesList?.find((x) => x?.themeId === themeId);

        totalSales = themeDetails?.totalSales;
        totalReviews = themeDetails?.totalReviews;
      }
      groups[themeName] = {
        items: responseGroupByName[themeName],
        totalSales,
        totalReviews,
      };
    }

    res.status(200).json(groups);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
}
