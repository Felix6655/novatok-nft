require("@nomicfoundation/hardhat-toolbox");

// Load env from .env.local (since that's where you're putting values)
require("dotenv").config({ path: ".env.local", override: true });

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

