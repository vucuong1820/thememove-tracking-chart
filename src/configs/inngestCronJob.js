import { LIMIT } from '@constants';
import themeMoveThemes, { otherThemes } from '@constants/themes';
import crawlThemes from '@helpers/crawlThemes';
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'thememove-tracking-chart' });

const handleCron = (index) =>
  inngest.createScheduledFunction(`AUTO-CRAWLING-${index}`, 'TZ=Australia/Sydney 45 23 * * *', async () => {
    const start = Number.parseInt(index);
    const themeList = [...themeMoveThemes, ...otherThemes];

    const themes = themeList.slice(start * LIMIT, start * LIMIT + LIMIT);

    await crawlThemes(themes);
    return `CRAWL SUCCESSFULLY: ${themes?.map((x) => x?.name)?.join(',')}`;
  });

export default handleCron;
