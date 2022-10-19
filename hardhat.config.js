/** 
 * @type import('hardhat/config').HardhatUserConfig 
 */
// require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
  // solidity: "0.8.9",
  defaultNetwork: "PolygonMumbai",
  networks: {
    hardhat: {},
    PolygonMumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
