const { LTO } = require("@ltonetwork/lto");
const dotenv = require("dotenv");
dotenv.config();

class LTOService {
  static async create() {
    const lto = new LTO("T");
    const seed = process.env.SEED;
    const account = await lto.account({ seed });
    return { account, lto };
  }

  static async transfer(recipient, amount) {
    const { account, lto } = await this.create();
    const value = parseInt(`${amount}00000000`);
    if (amount > 0 && recipient) {
      return lto.transfer(account, recipient, value);
    } else {
      throw new Error("Invalid amount or recipient");
    }
  }
}

module.exports = LTOService;
