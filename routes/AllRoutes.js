const express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/transactions", (req, res) => {
  const filePath = path.join(__dirname, "../data/transactions.json");

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
});

router.get("/blocks-daily", (req, res) => {
  const filePath = path.join(__dirname, "../data/blocks-daily.json");

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
});

router.get("/blocks-weekly", (req, res) => {
  const filePath = path.join(__dirname, "../data/blocks-weekly.json");

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
});

router.get("/blocks-monthly", (req, res) => {
  const filePath = path.join(__dirname, "../data/blocks-monthly.json");

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
});

module.exports = router;
