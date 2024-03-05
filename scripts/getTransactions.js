const axios = require("axios");
const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const path = require("path");

const transactionsPath = path.join(__dirname, "../data/transactions.json");
// const lastNPath = "../data/lastN.js";

const fromDate = "2019-01-12";

async function getTransactions() {
  try {
    const currentDate = new Date();
    const currentDateCopy = new Date(fromDate);
    const types = [
      "all",
      "anchor",
      "transfer",
      "mass_transfer",
      "all_transfers",
      "burn",
      "lease",
      "association",
      "script",
      "sponsor",
      "data",
      "statement",
    ];

    const transactionsData = [];

    while (currentDateCopy <= currentDate) {
      let toDate = new Date(currentDateCopy);
      toDate.setDate(toDate.getDate() + 49); // Adding 49 days to fromDate

      if (toDate > currentDate) {
        toDate = currentDate;
      }

      let periodTransactions = {
        period: `${currentDateCopy.toISOString().split("T")[0]} to ${
          toDate.toISOString().split("T")[0]
        }`,
      };

      for (const type of types) {
        const response = await axios.get(
          `https://nodes.lto.network/index/stats/transactions/${type}/${
            currentDateCopy.toISOString().split("T")[0]
          }/${toDate.toISOString().split("T")[0]}`
        );
        const data = response.data;

        data.forEach((d) => {
          if (d.period in periodTransactions) {
            periodTransactions[d.period][type] = d.count;
          } else {
            periodTransactions[d.period] = { [type]: d.count };
          }
        });
      }

      console.log(periodTransactions);

      transactionsData.push(periodTransactions);

      currentDateCopy.setDate(currentDateCopy.getDate() + 50);
    }

    // Check if the transactions file exists, if not, create it
    if (!fs.existsSync(transactionsPath)) {
      fs.writeFileSync(transactionsPath, "", "utf-8");
    }

    // Write transactions data to JSON file
    await writeFileAsync(
      transactionsPath,
      JSON.stringify(transactionsData),
      "utf-8"
    );
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

getTransactions();
