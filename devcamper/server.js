const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHanlder = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");

// load enviroment variables
dotenv.config({ path: "./config/config.env" });
const { NODE_ENV, PORT } = process.env;

// database connection
connectDB();
// body parser
const app = express();
app.use(express.json());
// file upload
app.use(fileUpload());
// static routes
app.use(express.static(path.join(__dirname, "public")));

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//app.use(require("./middleware/logger"));
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));
app.use("/api/v1/courses", require("./routes/courses"));
// error hanlder (AFTER routes definitions!)
app.use(errorHanlder);

const server = app.listen(PORT, () =>
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// unhandled promise rejections hanlder
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
