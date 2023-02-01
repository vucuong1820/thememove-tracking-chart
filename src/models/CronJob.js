const mongoose = require('mongoose');

const cronJobSchema = new mongoose.Schema(
  {
    status: String,
  },
  { timestamps: true },
);

const CronJobModel = mongoose.models.cronjob || mongoose.model('cronjob', cronJobSchema);

module.exports = CronJobModel;
