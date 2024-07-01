const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cron = require("node-cron");
const { spawn } = require("child_process");

// Routes
const AllRoutes = require("./routes/AllRoutes");
const Doc = require("./services/Doc.service");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));

const marketInfoScript = "getMarketInfo.js";
const blocksMonthlyScript = "getBlocksMonthly.js";
const otherScripts = [
  "getBlocksDaily.js",
  "getBlocksWeekly.js",
  "getTransactions.js",
];

let areOtherScriptsRunning = false;

const runScript = (script) => {
  const scriptPath = path.join(__dirname, "scripts", script);
  const childProcess = spawn("node", [scriptPath]);

  console.log(`Running script: ${script}`);

  childProcess.stdout.on("data", (data) => {
    console.log(`[${script}] stdout: ${data.toString()}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`[${script}] stderr: ${data.toString()}`);
  });

  childProcess.on("error", (error) => {
    console.error(`[${script}] Error: ${error.message}`);
  });

  childProcess.on("exit", (code, signal) => {
    if (code !== null) {
      console.log(`[${script}] exited with code ${code}`);
    }
    if (signal !== null) {
      console.log(`[${script}] killed with signal ${signal}`);
    }
  });
};

cron.schedule("*/1 * * * *", () => {
  runScript(marketInfoScript);
});

cron.schedule("*/1 * * * *", () => {
  if (!areOtherScriptsRunning) {
    areOtherScriptsRunning = true;
    let scriptsCompleted = 0;
    const scriptCount = otherScripts.length;

    const scriptCallback = () => {
      scriptsCompleted++;
      if (scriptsCompleted === scriptCount) {
        areOtherScriptsRunning = false;
      }
    };

    otherScripts.forEach((script) => runScript(script, scriptCallback));
  } else {
    console.log(`Skipping other scripts because they are still running.`);
  }
});

cron.schedule("*/5 * * * *", () => {
  runScript(blocksMonthlyScript);
});

cron.schedule("0 0 * * *", () => {
  //Reset the addresses for faucet every 24hrs
  const jsonData = [];
  const filePath = path.join(__dirname, "/data/faucet.json");
  Doc.writeFaucetFile(filePath, jsonData);
});

app.use(express.json());
app.use("/", AllRoutes);

module.exports = app;
