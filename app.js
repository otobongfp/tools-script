const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cron = require("node-cron");
const { spawn } = require("child_process"); // non-blocking execution

// Routes
const AllRoutes = require("./routes/AllRoutes");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));

const scripts = [
  "getBlocksDaily.js",
  "getBlocksWeekly.js",
  "getBlocksMonthly.js",
  "getTransactions.js",
];

const runScript = (script) => {
  const childProcess = spawn("node", [`scripts/${script}`]);

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data.toString()}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data.toString()}`);
  });

  childProcess.on("error", (error) => {
    console.error(`Error: ${error.message}`);
  });
};

console.log("Running the scripts...");
scripts.forEach(runScript);

cron.schedule("*/15 * * * *", () => {
  console.log("Running the scripts...");
  scripts.forEach(runScript);
});

app.use(express.json());

app.use("/", AllRoutes);

module.exports = app;

// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// const path = require("path");
// const cron = require("node-cron");
// const { exec } = require("child_process");

// //Routes
// const AllRoutes = require("./routes/AllRoutes");

// const app = express();
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(morgan("combined"));

// // Define an array of script filenames
// const scripts = [
//   "getBlocksDaily.js",
//   "getBlocksWeekly.js",
//   "getBlocksMonthly.js",
//   "getTransactions.js",
// ];

// // Execute the scripts immediately
// console.log("Running the scripts...");
// scripts.forEach((script) => {
//   exec(`node scripts/${script}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   });
// });

// //Every 15mins
// cron.schedule("*/15 * * * *", () => {
//   console.log("Running the scripts...");

//   // Execute scripts
//   scripts.forEach((script) => {
//     exec(`node scripts/${script}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//     });
//   });
// });

// app.use(express.json());

// app.use("/", AllRoutes);

// module.exports = app;
