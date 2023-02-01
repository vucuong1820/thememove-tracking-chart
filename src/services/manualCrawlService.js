import axios from 'axios';

export default async function manualCrawlService(themeId) {
  try {
    await axios.put('/api/manual-crawling', {
      themeId,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
