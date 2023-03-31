const { extendConfig } = require('hardhat/config')

extendConfig((config, userConfig) => {
  if (typeof config.solidity === 'string') {
    const version = config.solidity
    config.solidity = {
      compilers: [
        { version },
      ]
    }
  }
  if (typeof config.solidity.overrides !== 'object') {
    config.solidity.overrides = {}
  }
  config.solidity.overrides['poseidon-solidity/*'] = {
    version: '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 2**32 - 1
      }
    }
  }
})
