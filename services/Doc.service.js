const fs = require("fs");
const path = require("path");
const axios = require("axios");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);

class Doc {
  static async readData(filePath) {
    if (fs.existsSync(filePath)) {
      try {
        const data = await readFileAsync(filePath, "utf8");
        const info = JSON.parse(data);
        return info;
      } catch (err) {
        console.error("Error reading JSON file:", err);
        return null;
      }
    } else {
      console.error("File not found");
      return null;
    }
  }

  static async readFile(filePath, res) {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading JSON file:", err);
          res.status(500).send("Internal Server Error");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(200).send(data);
        }
      });
    } else {
      res.status(404).send("File not found");
    }
  }

  static async writeFaucetFile(filePath, jsonData) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(jsonData, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to JSON file:", writeErr);
          res.status(500).send("Internal Server Error");
        } else {
          res.status(200).send();
        }
      }
    );
  }

  static async writeData(transactionsPath, from, to, height) {
    let blocks = [];

    while (from <= height) {
      const response = await axios.get(
        `https://nodes.lto.network/blocks/seq/${from}/${to}`
      );
      const result = response.data;

      result.forEach((data) => {
        let block = {
          generator: data.generator,
          timestamp: data.timestamp,
          height: data.height,
          blockSize: data.blocksize,
          transactionCount: data.transactionCount,
          fee: data.fee,
          burnedFees: data.burnedFees,
          miningReward: data.miningReward,
          generatorReward: data.generatorReward,
        };
        blocks.push(block);
      });

      console.log("Blocks Written");

      from = to + 1;
      to = Math.min(from + 90, height);
    }

    fs.writeFileSync(transactionsPath, JSON.stringify(blocks) + "\n");
  }
}

module.exports = Doc;
