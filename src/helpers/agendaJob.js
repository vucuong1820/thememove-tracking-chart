import { JOB_EXPRESSION, JOB_NAME, TIME_ZONE } from '@constants';
import Agenda from 'agenda';
import crawlThemes from './crawlThemes';

/* eslint-disable no-console */
const agendaInstance = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'agenda-jobs' },
});

async function agendaJob() {
  agendaInstance.define(JOB_NAME, async (job, done) => {
    console.log('=======================');
    console.log('[AGENDA]: AUTO CRAWL THEME DATA');
    await crawlThemes();
    done();
  });

  (async function () {
    const crawlThemeData = agendaInstance.create(JOB_NAME).unique({ name: JOB_NAME });
    await agendaInstance.start();
    crawlThemeData.repeatEvery(JOB_EXPRESSION, {
      timezone: TIME_ZONE,
    });
    await crawlThemeData.save();
  })();
}

export default agendaJob;
