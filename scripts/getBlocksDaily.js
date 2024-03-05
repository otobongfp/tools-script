const axios = require("axios");
const fs = require("fs");
const path = require("path");

const transactionsPath = path.join(__dirname, "../data/blocks-daily.json");

async function getBlocks() {
  try {
    // Get current block height
    const currentBlockHeight = await axios.get(
      "https://nodes.lto.network/blocks/height"
    );

    // Subtract 45,000 from the current block height to know where to start iterating from
    const height = currentBlockHeight.data.height;
    let from = height - 1500;
    let to = from + 90;

    let blocks = [];

    // Hypothetically it takes over a month to mine that number of blocks
    // Iterate through new url to get the responses for the blocks
    let iterationCount = 0;
    while (from <= height) {
      const response = await axios.get(
        `https://nodes.lto.network/blocks/seq/${from}/${to}`
      );
      const result = response.data;

      // Based on the information extract the timestamp,
      // generator, burnedFees, miningReward, generatorReward, fee, height,
      // transactionCount, blockSizeclear
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

      console.log("Blocks fetched:", result.length);

      from = to + 1;
      to = Math.min(from + 90, height); // Ensure to doesn't exceed height
      console.log(from, to);
    }

    // Write blocks to file
    fs.writeFileSync(transactionsPath, JSON.stringify(blocks) + "\n");
    console.log("Blocks written to file.");

    console.log("Finished writing to file.");
  } catch (error) {
    console.error(error);
  }
}

getBlocks();
