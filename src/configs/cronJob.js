import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'My app' });

export default inngest.createScheduledFunction(
  'Weekly digest email', // The name of your function, used for observability.
  'TZ=America/New_York * * * * *', // The cron syntax for the function.  TZ= is optional.
  // This code will be called on the schedule above
  async () => {
    return 'test'; // You can write whatever you want here.
  },
);
