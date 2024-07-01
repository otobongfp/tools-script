const Doc = require("../services/Doc.service");
const path = require("path");

class FaucetService {
  static async reviewRequest(payload) {
    try {
      const filePath = path.join(__dirname, "../data/faucet.json");
      const pastRequests = await Doc.readData(filePath);
      if (!pastRequests) {
        return true;
      }

      const hasSimilarRequest = pastRequests.some(
        (req) => req.address === payload.address || req.ip === payload.ip
      );

      if (!hasSimilarRequest) {
        return true;
      }

      //   const hasValidRequest = pastRequests.some((req) => {
      //     if (req.address === payload.address || req.ip === payload.ip) {
      //       return this.isTimeValid(payload.timestamp, req.timestamp);
      //     }
      //     return false;
      //   });

      //   if (hasValidRequest) {
      //     return true;
      //   } else {
      //     console.log("No valid requests found within the time limit.");
      //     return false;
      //   }
    } catch (error) {
      console.error("Error reviewing request:", error);
      return false;
    }
  }

  //   static isTimeValid(currentTimestamp, previousTimestamp) {
  //     const timeDifference = currentTimestamp - previousTimestamp;
  //     const TIME_LIMIT = 86000;

  //     return timeDifference > TIME_LIMIT;
  //   }
}

module.exports = FaucetService;
