/* eslint-disable no-useless-escape */
import connectMongo from '@configs/connectMongo';
import { TIME_ZONE } from '@constants';
import themeMoveThemes, { otherThemes } from '@constants/themes';
import crawlThemes from '@helpers/crawlThemes';
import ThemeModel from '@models/Theme';
import axios from 'axios';
import cheerio from 'cheerio';
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

export default async function handler(req, res) {
  // eslint-disable-next-line no-console
  console.log('MANUAL CRAWLING');
  const { themeId } = req.query;
  const themeList = [...themeMoveThemes, ...otherThemes];
  const theme = themeList.find((x) => x.themeId === Number.parseInt(themeId));
  const { url, name, fixedSales, fixedReviews } = theme;

  const crawlRes = await axios.get(`${url}/reviews/${themeId}`);

  const $ = cheerio.load(crawlRes.data);

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
      themeId: Number.parseInt(themeId),
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
  res.json();
}
