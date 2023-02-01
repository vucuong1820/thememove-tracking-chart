// import { serve } from 'inngest/next';
// import handleCronJob from '@configs/cronJob';
// import themeMoveThemes, { otherThemes } from '@constants/themes';
// import { LIMIT } from '@constants';

// const listFunction = () => {
//   const themeList = [...themeMoveThemes, ...otherThemes];

//   return Array.from({ length: Math.ceil(themeList.length / LIMIT) }).map((item, index) => {
//     return () => handleCronJob(index);
//   });
// };
// export default serve('thememove-tracking-chart', listFunction);
