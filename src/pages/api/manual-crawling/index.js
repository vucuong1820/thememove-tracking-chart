/* eslint-disable no-useless-escape */
import crawlThemes from '@helpers/crawlThemes';

export default async function handler(req, res) {
  await crawlThemes();
  res.json();
}
