import { serve } from 'inngest/next';
import handleCronJob from '@configs/inngestCronJob';

export default serve('thememove-tracking-chart', [handleCronJob]);
