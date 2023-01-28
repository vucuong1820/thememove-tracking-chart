import axios from 'axios';

export default async function manualCrawlService() {
  await axios.get(`/api/manual-crawling`);
}
