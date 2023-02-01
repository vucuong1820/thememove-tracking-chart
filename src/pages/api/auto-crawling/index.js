// import themeMoveThemes, { otherThemes } from '@constants/themes';
// import crawlThemes from '@helpers/crawlThemes';

// const LIMIT = 5;

// export default async function handler(req, res) {
//   const { index } = req.query;
//   const start = Number.parseInt(index);
//   const themeList = [...themeMoveThemes, ...otherThemes];

//   const themes = themeList.slice(start * LIMIT, start * LIMIT + LIMIT);

//   await crawlThemes(themes);
//   res.status(200).send(`CRAWL SUCCESSFULLY: ${themes?.map((x) => x?.name)?.join(',')}`);
// }

import { serve } from 'inngest/next';
import handleCronJob from '@configs/inngestCronJob';

export default serve('thememove-tracking-chart', [handleCronJob]);
