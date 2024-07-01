const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Doc = require("../services/Doc.service");
const transactionsPath = path.join(__dirname, "../data/blocks-weekly.json");

async function getBlocks() {
  try {
    // Get current block height
    const currentBlockHeight = await axios.get(
      "https://nodes.lto.network/blocks/height"
    );

    // Approx. 10050 blocks are prod. per week
    const height = currentBlockHeight.data.height;
    let from = height - 10050;
    let to = from + 90;

    console.log("Weekly mined blocks");

    Doc.writeData(transactionsPath, from, to, height);
  } catch (error) {
    console.error(error);
  }
}

getBlocks();
