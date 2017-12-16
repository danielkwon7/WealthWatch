const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

require('dotenv').config();

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds135926.mlab.com:35926/wealthwatch`;
console.log('uri::', uri)

mongoose
  .connect(uri, {
    useMongoClient: true
  })
  .then(() => console.log('database connected'))
  .catch((err) => {
    console.log(err);
  });

const database = mongoose.connection;
module.exports = database;
