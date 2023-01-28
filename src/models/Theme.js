const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    name: String,
    themeId: Number,
    url: String,
    totalSales: Number,
    salesPerDay: Number,
    rating: Number,
    totalReviews: Number,
    reviewsPerDay: Number,
  },
  { timestamps: true },
);

const ThemeModel = mongoose.models.theme || mongoose.model('theme', themeSchema);

module.exports = ThemeModel;
