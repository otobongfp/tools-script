const axios = require("axios");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();
const URL = process.env.API_URL;

const currentFilePath = __filename;
const currentDirPath = __dirname;

// Define the directory structure
const dataDir = currentDirPath + "/../data";
const addressesFilePath = dataDir + "/addresses.json";
const allAddressesFilePath = dataDir + "/allAddresses.json";
const lastNFilePath = dataDir + "/lastN.js";

const filePaths = {
  lastNFilePath: dataDir + "/lastN.js",
  addressesFilePath: dataDir + "/addresses.json",
  allAddressesFilePath: dataDir + "/allAddresses.json",
};

getAddresses();

async function getAddresses() {
  try {
    let lastN;

    if (fs.existsSync(lastNFilePath)) {
      const content = fs.readFileSync(lastNFilePath, "utf-8").trim();
      lastN = content ? parseInt(content, 10) : 0;
    } else {
      for (const filePathKey in filePaths) {
        const filePath = filePaths[filePathKey];
        if (!fs.existsSync(filePath)) {
          const directory = filePath.split("/").slice(0, -1).join("/");
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
          }
          fs.writeFileSync(filePath, "", "utf-8");
        }
      }
      fs.writeFileSync(lastNFilePath, "0", "utf-8");
      lastN = 0;
    }

    const blockHeightResponse = await axios.get(`${URL}blocks/height`);
    const blockHeight = Number(blockHeightResponse.data.height);

    console.log(`blockheight = ${blockHeight}`);

    //To hold a list of transactions
    let addresses = [];

    if (blockHeight) {
      console.log("Sequencing the Blocks");

      for (let n = lastN; n <= blockHeight; n += 10) {
        // Tranverse 10 blocks per time
        const response = await axios.get(`${URL}blocks/seq/${n}/${n + 10}`);

        // const response = await axios.get(
        //   `http://178.62.234.225/blocks/at/${n}`
        // );

        const blockData = response.data;

        //Returns just the addresses of either sender or receiver
        const extractedAddresses = blockData.flatMap((obj) =>
          obj.transactions.map((transaction) => {
            const sender = transaction.sender;
            const recipient = transaction.recipient;

            //if recipient exists and is not an empty string
            if (recipient !== undefined && recipient.trim() !== "") {
              return [sender, recipient];
            } else {
              // If recipient does not exist
              return [sender];
            }
          })
        );

        addresses = addresses.concat(extractedAddresses).flat(1);
        console.log(addresses);

        //write out the current value of n
        fs.writeFileSync(lastNFilePath, n.toString(), "utf-8");

        //Write out the addresses
        handleWrite(addresses);

        console.log(`N = ${n}`);
      }
    }

    console.log("Transactions fetched and stored successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}


async function handleWrite(addresses) {
  try {
    let addressesWithBalance = [];

    // Fetch balance for each address
    for (const address of addresses) {
      try {
        const response = await axios.get(
          `https://nodes.lto.network/addresses/balance/${address}`
        );
        const balance = response.data.balance;
        addressesWithBalance.push({ address, balance });
      } catch (error) {
        console.error(
          `Error fetching balance for address ${address}:`,
          error.message
        );
      }
    }

    // Read the contents of the addresses file
    let addressesContent = fs.readFileSync(addressesFilePath, "utf-8");

    // Check if the file is empty or does not contain valid JSON data
    let addressesArray = [];
    if (addressesContent.trim()) {
      addressesArray = JSON.parse(addressesContent);
    }

    // Remove duplicates from the addresses array
    addressesWithBalance = addressesWithBalance.filter(
      ({ address }) => !addressesArray.some((item) => item.address === address)
    );

    // If there are new non-null addresses, append them to the addresses file
    if (addressesWithBalance.length > 0) {
      addressesArray = addressesArray.concat(addressesWithBalance);
      fs.writeFileSync(
        addressesFilePath,
        JSON.stringify(addressesArray, null, 2),
        "utf-8"
      );

      // Read the contents of the allAddresses file
      let allAddressesContent = fs.readFileSync(allAddressesFilePath, "utf-8");
      let allAddressesArray = [];
      if (allAddressesContent.trim()) {
        allAddressesArray = JSON.parse(allAddressesContent);
      }

      // Collapse all arrays in allAddresses into one array
      let collapsedArray = allAddressesArray.flat();

      // Concatenate the new non-null addresses with the collapsed array
      collapsedArray = collapsedArray.concat(addressesWithBalance);

      // Remove duplicates from the collapsed array
      collapsedArray = [...new Set(collapsedArray)];

      // Write the collapsed array back to the allAddresses file
      fs.writeFileSync(
        allAddressesFilePath,
        JSON.stringify(collapsedArray, null, 2),
        "utf-8"
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
