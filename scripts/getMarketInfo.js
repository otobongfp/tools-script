// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// const transactionsPath = path.join(__dirname, "../data/marketData.json");

// class MarketInfo {
//   static async getMarketInfo() {
//     try {
//       const coinGeckoReq = axios.get(
//         "https://api.coingecko.com/api/v3/simple/price",
//         {
//           params: {
//             ids: "lto-network",
//             vs_currencies: "usd",
//             include_market_cap: true,
//           },
//         }
//       );

//       const binanceReq = axios.get(
//         "https://api.binance.com/api/v3/ticker/price?symbol=LTOUSDT"
//       );

//       // Race between CoinGecko and Binance requests
//       const response = await Promise.race([
//         this.timeout(coinGeckoReq, 3000),
//         binanceReq,
//       ]);

//       let dataFromCoinGecko, binancePrice;
//       if (response.hasOwnProperty("data")) {
//         dataFromCoinGecko = response?.data["lto-network"];
//       } else {
//         binancePrice = parseFloat(response?.data.price);
//       }

//       const checkAvailablePrice =
//         dataFromCoinGecko && dataFromCoinGecko.usd
//           ? dataFromCoinGecko.usd
//           : binancePrice;

//       const estMarketCap = binancePrice
//         ? await this.getMarketCap(checkAvailablePrice)
//         : null;

//       const result = {
//         geckoPrice: dataFromCoinGecko
//           ? parseFloat(dataFromCoinGecko.usd.toFixed(4))
//           : null,
//         geckoMarketCap: dataFromCoinGecko
//           ? Math.floor(dataFromCoinGecko.usd_market_cap)
//           : null,
//         binancePrice: binancePrice ? binancePrice.data.price : null,
//         estimatedMarketCap: estMarketCap,
//       };

//       if (result.geckoPrice || result.binancePrice !== null) {
//         this.handleWrite(result);
//       }

//       return result;
//     } catch (error) {
//       console.log("error", error);
//     }
//   }

//   static async getMarketCap(priceData) {
//     try {
//       const circulatingSupply = await axios.get(
//         `https://stats.ltonetwork.com/v1/stats/supply/circulating`
//       );

//       return priceData * circulatingSupply.data;
//     } catch (error) {}
//   }

//   static async timeout(promise, ms) {
//     return new Promise((resolve, reject) => {
//       const timeoutId = setTimeout(() => {
//         clearTimeout(timeoutId);
//         reject(new Error("Timed out"));
//       }, ms);
//       promise.then(
//         (res) => {
//           clearTimeout(timeoutId);
//           resolve(res);
//         },
//         (err) => {
//           clearTimeout(timeoutId);
//           reject(err);
//         }
//       );
//     });
//   }

//   static async handleWrite(jsonData) {
//     fs.writeFileSync(transactionsPath, JSON.stringify(jsonData));
//   }
// }

// MarketInfo.getMarketInfo();

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const transactionsPath = path.join(__dirname, "../data/marketData.json");

class MarketInfo {
  static async getMarketInfo() {
    try {
      let dataFromCoinGecko = null;
      let binancePrice = null;

      // First attempt with CoinGecko
      try {
        const coinGeckoResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            params: {
              ids: "lto-network",
              vs_currencies: "usd",
              include_market_cap: true,
            },
          }
        );
        dataFromCoinGecko = coinGeckoResponse.data["lto-network"];
        console.log(dataFromCoinGecko);
      } catch (error) {
        console.log("CoinGecko request failed:", error.message);
      }

      // If CoinGecko data is not available, fallback to Binance
      if (!dataFromCoinGecko || !dataFromCoinGecko.usd) {
        try {
          const binanceResponse = await axios.get(
            "https://api.binance.com/api/v3/ticker/price?symbol=LTOUSDT"
          );
          binancePrice = parseFloat(binanceResponse.data.price);
          console.log(binancePrice);
        } catch (error) {
          console.log("Binance request failed:", error.message);
        }
      }

      const checkAvailablePrice =
        dataFromCoinGecko && dataFromCoinGecko.usd
          ? dataFromCoinGecko.usd
          : binancePrice;

      const estMarketCap = binancePrice
        ? await this.getMarketCap(checkAvailablePrice)
        : null;

      const result = {
        geckoPrice: dataFromCoinGecko
          ? parseFloat(dataFromCoinGecko.usd.toFixed(4))
          : null,
        geckoMarketCap: dataFromCoinGecko
          ? Math.floor(dataFromCoinGecko.usd_market_cap)
          : null,
        binancePrice: binancePrice ? binancePrice : null,
        estimatedMarketCap: estMarketCap,
      };

      if (result.geckoPrice !== null || result.binancePrice !== null) {
        this.handleWrite(result);
      }

      return result;
    } catch (error) {
      console.log("error", error);
    }
  }

  static async getMarketCap(priceData) {
    try {
      const circulatingSupply = await axios.get(
        `https://stats.ltonetwork.com/v1/stats/supply/circulating`
      );

      return priceData * circulatingSupply.data;
    } catch (error) {
      console.log("Error fetching circulating supply:", error.message);
    }
  }

  static async handleWrite(jsonData) {
    fs.writeFileSync(transactionsPath, JSON.stringify(jsonData));
  }
}

MarketInfo.getMarketInfo();
