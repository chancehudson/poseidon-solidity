# poseidon-solidity [![CircleCI](https://img.shields.io/circleci/build/github/vimwitch/poseidon-solidity/main)](https://dl.circleci.com/status-badge/redirect/gh/vimwitch/poseidon-solidity/tree/main)

Poseidon implementation in Solidity over alt_bn128 (aka BN254).

**This implementation has not been audited.**

## Benchmark

```yaml
T2 hash
  - poseidon-solidity: 13,488 gas
  - circomlibjs: 19,395 gas
  - address: 0x222333c8a7B92FED0d3C1E8c764411283e09b9a7

T3 hash
  - poseidon-solidity: 21,124 gas
  - circomlibjs: 32,173 gas
  - address: 0x3333339553F15711E6830C8d43b28a1Cb6c1cD6B

T4 hash
  - poseidon-solidity: 37,617 gas
  - circomlibjs: 48,267 gas
  - address: 0x4443331ed582e1cb5692d89CC7af32e783A35220

T5 hash
  - poseidon-solidity: 54,326 gas
  - circomlibjs: 73,307 gas
  - address: 0x555333B0c9177d9960fB2b799Ea8fD3Af4098703

T6 hash
  - poseidon-solidity: 74,039 gas
  - circomlibjs: 100,197 gas
  - address: 0x66633394129a7CE61F246C3a2F6B0E53cC084a94

# ---

Deploy cost (T3)
  - poseidon-solidity: 5,129,638 gas
  - circomlibjs: 2,156,516 gas
```

## Use

```sh
npm i poseidon-solidity
```

```solidity
import "poseidon-solidity/PoseidonT3.sol";

contract Example {

  function combine(uint input0, uint input1) public {
    uint out = PoseidonT3.hash([input0, input1]);
  }

}
```

## Deploy

This package includes pre-calculated transactions that can be used to deploy these contracts to the same address on any chain. This is called [Nick's method](https://eips.ethereum.org/EIPS/eip-1820#deployment-method), where a signature `r` and `s` are chosen arbitrarily, and the sending address is calculated using `ecrecover`.

To deploy in a hardhat type environment:

```js
const { PoseidonT3 } = require('poseidon-solidity')

const [sender] = await ethers.getSigners()

if (await ethers.provider.getCode(PoseidonT3.address) === '0x') {
  // fund the keyless account
  await sender.sendTransaction({
    to: PoseidonT3.from,
    value: PoseidonT3.gas,
  })

  // then send the presigned transaction deploying the contract
  await ethers.provider.sendTransaction(PoseidonT3.tx)
}

console.log(`PoseidonT3 deployed to: ${PoseidonT3.address}`)
```

## Testing

```sh
npm install
npm test
```

<br />

<div align="center">
<a href="https://appliedzkp.org">
<img width="50px" height="auto" src="https://raw.githubusercontent.com/vimwitch/poseidon-solidity/main/pse_logo.svg" />
</a>
</div>
