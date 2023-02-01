import { serve } from 'inngest/next';
import handleCronJob from '@configs/inngestCronJob';
import themeMoveThemes, { otherThemes } from '@constants/themes';
import { LIMIT } from '@constants';

const listFunction = () => {
  const themes = [...themeMoveThemes, ...otherThemes];
  return Array.from({ length: Math.ceil(themes.length / LIMIT) }).map((item, index) => handleCronJob(index));
};
export default serve('thememove-tracking-chart', listFunction());
