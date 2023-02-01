import { serve } from 'inngest/next';
import handleCronJob from '@configs/cronJob';

export default serve(
  'thememove-tracking-chart', // Your app name
  [handleCronJob], // A list of functions to expose.  This can be empty to start.
);
