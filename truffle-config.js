const path = require("path");
require('dotenv').config({path: "./.env"});
const HDWalletProvider = require('@truffle/hdwallet-provider');
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,       
      network_id: "*", 
     },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, 'http://127.0.0.1:8545', AccountIndex)
      },
      network_id: 5777
    },
    rinkeby_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, 'https://rinkeby.infura.io/v3/bff6ddfbc539450c8bda156c8a71484c', AccountIndex)
      },
      network_id: 4
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, 'https://ropsten.infura.io/v3/bff6ddfbc539450c8bda156c8a71484c', AccountIndex)
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
