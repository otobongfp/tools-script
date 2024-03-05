const axios = require("axios");
const fs = require("fs");
const URL = process.env.API_URL;

const balances = "../data/balances.json";
const lastNPath = "../data/lastN.js";

getBalances();

async function getBalances() {
  let lastN;

  if (fs.existsSync(lastNPath)) {
    const content = fs.readFileSync(lastNPath, "utf-8").trim();
    lastN = content ? parseInt(content, 10) : 0;
  } else {
    fs.writeFileSync(lastNPath, "0", "utf-8");
    lastN = 0;
  }

  const blockHeight = await axios.get(`${URL}blocks/height`);
}
