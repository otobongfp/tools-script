const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Doc = require("../services/Doc.service");

const transactionsPath = path.join(__dirname, "../data/blocks-daily.json");

async function getBlocks() {
  try {
    // Get current block height
    const currentBlockHeight = await axios.get(
      "https://nodes.lto.network/blocks/height"
    );

    // approx. 1500 blocks are prod. per day
    const height = currentBlockHeight.data.height;
    let from = height - 1500;
    let to = from + 90;

    console.log("Daily mined blocks");

    Doc.writeData(transactionsPath, from, to, height);
  } catch (error) {
    console.error(error);
  }
}

getBlocks();
