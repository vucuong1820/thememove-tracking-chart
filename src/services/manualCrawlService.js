import axios from 'axios';

export default async function manualCrawlService(themeId) {
  try {
    await axios.get(`/api/manual-crawling`, {
      params: {
        themeId,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
