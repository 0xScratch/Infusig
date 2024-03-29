require('@nomicfoundation/hardhat-ethers');

const { privateKey, https } = require('./secret.json');

module.exports = {
  solidity: '0.8.20',
  networks: {
    moonbase: {
      url: 'https://moonbase-alpha.blastapi.io/d674f3b3-cfe9-4e7b-8d4f-601e1e1d17d2',
      chainId: 1287,
      accounts: [privateKey]
    },
    optimism: {
      url: https,
      chainId: 11155420,
      accounts: [privateKey]
    }
  }
};