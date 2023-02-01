import themeMoveThemes, { otherThemes } from '@constants/themes';
import crawlThemes from '@helpers/crawlThemes';
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'thememove-tracking-chart' });

export default inngest.createScheduledFunction('AUTO-CRAWLING', 'TZ=America/New_York * * * * *', async () => {
  const themeList = [...themeMoveThemes, ...otherThemes];
  await crawlThemes(themeList);
  return `CRAWL SUCCESSFULLY: ${themeList.join(', ')}`;
});
