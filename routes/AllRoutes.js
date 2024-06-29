const express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const Doc = require("../services/Doc.service");
const LTOService = require("../services/LTO.service");

router.get("/transactions", (req, res) => {
  const filePath = path.join(__dirname, "../data/transactions.json");
  Doc.readFile(filePath, res);
});

router.get("/blocks-daily", (req, res) => {
  const filePath = path.join(__dirname, "../data/blocks-daily.json");
  Doc.readFile(filePath, res);
});

router.get("/blocks-weekly", (req, res) => {
  const filePath = path.join(__dirname, "../data/blocks-weekly.json");
  Doc.readFile(filePath, res);
});

router.get("/blocks-monthly", (req, res) => {
  const filePath = path.join(__dirname, "../data/blocks-monthly.json");
  Doc.readFile(filePath, res);
});

router.get("/marketInfo", (req, res) => {
  const filePath = path.join(__dirname, "../data/marketData.json");
  Doc.readFile(filePath, res);
});

router.post("/faucet", (req, res) => {
  const filePath = path.join(__dirname, "../data/faucet.json");

  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        let jsonData = [];
        try {
          jsonData = JSON.parse(data);
        } catch (parseErr) {
          console.error("Error parsing JSON file:", parseErr);
          return res.status(500).send("Internal Server Error");
        }
        jsonData.push(req.body);
        const { amount, address } = req.body;
        console.log(amount, address);
        LTOService.transfer(address, amount);
        Doc.writeFile(filePath, jsonData);
      }
    });
  } else {
    const jsonData = [req.body];
    Doc.writeFile(filePath, jsonData);
  }
});

module.exports = router;
