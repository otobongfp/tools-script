//handle write and read actions to the data dir
const fs = require("fs");
const path = require("path");

class Doc {
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

  static async writeFile(filePath, jsonData) {
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
}

module.exports = Doc;
