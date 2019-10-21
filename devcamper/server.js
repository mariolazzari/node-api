const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// load enviroment variables
dotenv.config({ path: "./config/config.env" });
const { NODE_ENV, PORT } = process.env;

const app = express();
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//app.use(require("./middleware/logger"));
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));

app.listen(PORT, () =>
  console.log(`Server started in ${NODE_ENV} mode on port ${PORT}`)
);
