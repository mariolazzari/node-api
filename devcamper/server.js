const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");

// load enviroment variables
dotenv.config({ path: "./config/config.env" });
const { NODE_ENV, PORT } = process.env;

// database connection
connectDB();
// body parser
const app = express();
app.use(express.json());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//app.use(require("./middleware/logger"));
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));

const server = app.listen(PORT, () =>
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// unhandled promise rejections hanlder
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
