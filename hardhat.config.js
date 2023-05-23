require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("./tasks/block-number")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    ha: {
      url: "http://127.0.0.1:8540/",
      accounts: ['0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'],
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  solidity: "0.8.8",
}
