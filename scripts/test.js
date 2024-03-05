async function handleWrite(addresses) {
  try {
    // Iterate through each address
    for (const address of addresses) {
      // Check if the address already exists in allAddresses.json
      const allAddressesContent = fs.readFileSync(
        allAddressesFilePath,
        "utf-8"
      );
      const allAddressesArray = allAddressesContent
        ? JSON.parse(allAddressesContent)
        : [];

      if (!allAddressesArray.some((obj) => obj.address === address)) {
        // Fetch the balance for the address
        const balanceResponse = await axios.get(
          `https://nodes.lto.network/addresses/balance/${address}`
        );
        const balance = balanceResponse.data.balance;

        // Create an object with the address and its balance
        const addressObject = { address, balance };

        // Append the address object to allAddresses.json
        allAddressesArray.push(addressObject);

        // Write the updated array back to allAddresses.json
        fs.writeFileSync(
          allAddressesFilePath,
          JSON.stringify(allAddressesArray, null, 2),
          "utf-8"
        );
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
