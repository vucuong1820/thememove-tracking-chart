const mongoose = require('mongoose');
require('dotenv').config();

const connection = {};

async function connectMongo() {
  if (connection.isConnected) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('ENV:', process.env.MONGO_URI);
  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // mongoose.set('debug', true);

  connection.isConnected = db.connections[0].readyState;
  // eslint-disable-next-line no-console
}

module.exports = connectMongo;
