require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("./tasks/block-number")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("@nomiclabs/hardhat-ganache");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { COINMARKETCAP_API_KEY, BSC_RPC_URL, SEPOLIA_RPC_URL, MUMBAI_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
const apiKeys = {
  COINMARKETCAP_API_KEY: COINMARKETCAP_API_KEY || "",
  BSC_RPC_URL: BSC_RPC_URL || "",
  SEPOLIA_RPC_URL: SEPOLIA_RPC_URL || "",
  MUMBAI_RPC_URL: MUMBAI_RPC_URL || "",
  PRIVATE_KEY: PRIVATE_KEY || "",
  ETHERSCAN_API_KEY: ETHERSCAN_API_KEY || ""
};


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    bsc: {
      url: apiKeys.BSC_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 97,
    },
    sepolia: {
      url: apiKeys.SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    mumbai: {
      url: apiKeys.SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    lh: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    gnc: {
      url: "http://127.0.0.1:7545/",
      chainId: 1337,
    },
  },
  solidity: "0.8.8",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
}
