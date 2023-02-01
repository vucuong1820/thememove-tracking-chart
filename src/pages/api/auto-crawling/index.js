import themeMoveThemes, { otherThemes } from '@constants/themes';
import crawlThemes from '@helpers/crawlThemes';

const LIMIT = 10;

export default async function handler(req, res) {
  const { index } = req.query;
  const start = Number.parseInt(index);
  const themeList = [...themeMoveThemes, ...otherThemes];

  const themes = themeList.slice(start * LIMIT, start * LIMIT + LIMIT);

  await crawlThemes(themes);
  res.json();
}
