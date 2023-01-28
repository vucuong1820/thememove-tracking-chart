import axios from 'axios';

export default async function autoCrawlService() {
  await axios.get('/api/auto-crawling');
}
