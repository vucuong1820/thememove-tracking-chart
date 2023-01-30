/* eslint-disable no-useless-escape */
import themeMoveThemes from '@constants/themes';
import themeShop from '@constants/themes';
import Theme from '@models/Theme';
import { cloneDeep, groupBy } from 'lodash';

// dbConnect();

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

    const responseGroupByName = groupBy(cloneDeep(response), 'name');

    const groups = Object.keys(responseGroupByName).reduce((res, themeName) => {
      let totalSales;
      const theme = themes.find((theme) => theme.name === themeName);
      //   if (theme) {
      //     const { themeId, url } = theme;

      //     axios.get(`${url}/reviews/${themeId}`).then((res) => {
      //       const $ = cheerio.load(res.data);
      //       console.log(Number($('.item-header__sales-count').text().replace(/\D/g, '')));
      //       totalSales = Number($('.item-header__sales-count').text().replace(/\D/g, ''));
      //     });
      //   }
      res[themeName] = {
        items: responseGroupByName[themeName],
        totalSales,
      };
      return res;
    }, {});
    res.status(200).json(groups);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(error.response.status).send(error.response.data);
  }
}
