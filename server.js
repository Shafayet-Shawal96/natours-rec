// detailed Console log is for development
require("./utils/detailedConsolelog");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION * SHUTTING DOWN....");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set({ strictQuery: false });

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("server is listening");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLER REJECTION * SHUTTING DOWN....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
