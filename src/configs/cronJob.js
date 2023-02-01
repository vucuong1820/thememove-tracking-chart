import { LIMIT } from '@constants';
import themeMoveThemes, { otherThemes } from '@constants/themes';
import crawlThemes from '@helpers/crawlThemes';
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'thememove-tracking-chart' });

export default inngest.createScheduledFunction('AUTO CRAWL THEMEMOVE THEMES ', 'TZ=America/New_York * * * * *', async (index) => {
  const start = Number.parseInt(index);
  const themeList = [...themeMoveThemes, ...otherThemes];

  const themes = themeList.slice(start * LIMIT, start * LIMIT + LIMIT);
  await crawlThemes(themes);
  return `CRAWL SUCCESSFULLY: ${themes.join(', ')}`;
});
