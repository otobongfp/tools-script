const express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const Doc = require("../services/Doc.service");
const LTOService = require("../services/LTO.service");
const FaucetService = require("../services/Faucet.service");

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

router.post("/faucet", async (req, res) => {
  const filePath = path.join(__dirname, "../data/faucet.json");

  try {
    let jsonData = [];

    if (fs.existsSync(filePath)) {
      const data = await fs.promises.readFile(filePath, "utf8");
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing JSON file:", parseErr);
        return res.status(500).send("Internal Server Error");
      }
    }

    jsonData.push(req.body);

    const validity = await FaucetService.reviewRequest(req.body);

    if (validity) {
      console.log("Can Receive");
      //LTOService.transfer(address, amount);
      res.status(200).json({ status: 200, message: "OK" });
    } else {
      res.sendStatus(403);
    }

    await Doc.writeFaucetFile(filePath, jsonData);
  } catch (err) {
    console.error("Error handling the faucet request:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
