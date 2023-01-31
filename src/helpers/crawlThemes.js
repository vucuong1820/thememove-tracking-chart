/* eslint-disable no-useless-escape */
/* eslint-disable no-console */

import connectMongo from '@configs/connectMongo';
import { TIME_ZONE } from '@constants';
import themeShop, { otherThemes } from '@constants/themes';
import ThemeModel from '@models/Theme';
import axios from 'axios';
import { load } from 'cheerio';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

connectMongo();
const getPreviousData = async (dayStart, name) => {
  const data = await ThemeModel.findOne(
    {
      name,
      createdAt: {
        $lt: dayStart,
      },
    },
    {},
    { sort: { createdAt: -1 } },
  );
  return data;
};

const crawlThemes = async () => {
  try {
    console.log('[AUTO CRAWL]');
    const listTheme = [...themeShop, ...otherThemes];
    listTheme.forEach(async (theme) => {
      const { url, themeId, name, fixedSales, fixedReviews } = theme;
      // const themeData = await getThemeData(themeId);

      const crawlRes = await axios.get(`${url}/reviews/${themeId}`);

      const $ = load(crawlRes.data);

      const rating = Number(
        parseFloat(
          $('.is-visually-hidden')
            .text()
            .match(/[\d\.]+/),
        ),
      );
      const totalReviews = Number($('.t-body.-size-l.h-m0').text().replace(/\D/g, ''));
      const totalSales = Number($('.item-header__sales-count').text().replace(/\D/g, ''));

      const currentDate = new Date();
      const dayStart = zonedTimeToUtc(startOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString();
      const dayEnd = zonedTimeToUtc(endOfDay(utcToZonedTime(currentDate, TIME_ZONE)), TIME_ZONE).toISOString();

      const previousData = await getPreviousData(dayStart, name);
      await ThemeModel.findOneAndUpdate(
        {
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd,
          },
          themeId: themeId,
          name: name,
        },
        {
          totalSales,
          salesPerDay: totalSales - (previousData?.totalSales ?? fixedSales),
          rating,
          totalReviews,
          reviewsPerDay: totalReviews - (previousData?.totalReviews ?? fixedReviews),
        },
        { upsert: true },
      );
      console.log('[CRAWL:]', name);
    });
    console.log('[FINISH CRAWL]');
  } catch (error) {
    console.log(error);
  }
};

export default crawlThemes;
