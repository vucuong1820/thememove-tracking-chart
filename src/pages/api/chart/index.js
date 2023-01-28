/* eslint-disable no-useless-escape */
import themeShop from '@constants/themes';
import Theme from '@models/Theme';
import axios from 'axios';
import cheerio from 'cheerio';
import { cloneDeep, groupBy } from 'lodash';

// dbConnect();

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
        console.log('count');

        const crawlRes = await axios.get(`${url}/reviews/${themeId}`);

        const $ = cheerio.load(crawlRes.data);
        totalReviews = Number($('.t-body.-size-l.h-m0').text().replace(/\D/g, ''));
        totalSales = Number($('.item-header__sales-count').text().replace(/\D/g, ''));
      }
    }

    const response = await Theme.find(filters);

    const responseGroupByName = groupBy(cloneDeep(response), 'name');

    const groups = Object.keys(responseGroupByName).reduce((res, themeName) => {
      let totalSales;
      const theme = themeShop.find((theme) => theme.name === themeName);
      // if (theme) {
      //   const { themeId, url } = theme;

      //   axios.get(`${url}/reviews/${themeId}`).then((res) => {
      //     const $ = cheerio.load(res.data);
      //     totalSales = Number($('.item-header__sales-count').text().replace(/\D/g, ''));
      //   });
      // }
      res[themeName] = {
        items: responseGroupByName[themeName],
        totalSales,
      };
      return res;
    }, {});
    res.status(200).json({
      items: response,
      groups,
      totalSales,
      totalReviews,
    });
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
}
