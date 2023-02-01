import { serve } from 'inngest/next';
import func from '@configs/cronJob';

export default serve(
  'thememove-tracking-chart', // Your app name
  [func], // A list of functions to expose.  This can be empty to start.
);
