const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

//Routes
const AllRoutes = require("./routes/AllRoutes");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));

// Define an array of script filenames
const scripts = [
  "getBlocksDaily.js",
  "getBlocksWeekly.js",
  "getBlocksMonthly.js",
  "getTransactions.js",
];

// Execute the scripts immediately
console.log("Running the scripts...");
scripts.forEach((script) => {
  exec(`node scripts/${script}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

//run every 2 hours
cron.schedule("*/15 * * * *", () => {
  console.log("Running the scripts...");

  // Execute scripts
  scripts.forEach((script) => {
    exec(`node scripts/${script}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  });
});

app.use(express.json());

app.use("/", AllRoutes);

module.exports = app;
