import connectMongo from '@configs/connectMongo';
import themeShop from '@constants/themes';
import Theme from '@models/Theme';
import axios from 'axios';
import { load } from 'cheerio';

connectMongo();

export default async function handler(req, res) {
  try {
    const { startingDay, endingDay, themeId } = req.query;

    let totalSales;
    let totalReviews;

    const filters = {
      createdAt: {
        $gte: startingDay,
        $lte: endingDay,
      },
    };

    if (themeId) {
      filters.themeId = themeId;
      const theme = themeShop.find((theme) => theme.themeId === Number(themeId));
      if (theme) {
        const { themeId, url } = theme;

        const crawlRes = await axios.get(`${url}/reviews/${themeId}`);

        const $ = load(crawlRes.data);
        totalReviews = Number($('.t-body.-size-l.h-m0').text().replace(/\D/g, ''));
        totalSales = Number($('.item-header__sales-count').text().replace(/\D/g, ''));
      }
    }

    const response = await Theme.find(filters);

    res.status(200).json({
      items: response,
      totalSales,
      totalReviews,
    });
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
}
