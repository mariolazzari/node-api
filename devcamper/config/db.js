const mongoose = require("mongoose");
const dotenv = require("dotenv");

// load enviroment vars
dotenv.config({ path: "./config/config.env" });
const { MONGO_URI } = process.env;

// mongo db connection options
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const connectDB = async () => {
  await mongoose.connect(MONGO_URI, options);
  console.log(`MongoDB coneected at ${MONGO_URI}`.cyan.underline.bold);
};

module.exports = connectDB;
