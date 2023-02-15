# poseidon-solidity [![CircleCI](https://img.shields.io/circleci/build/github/vimwitch/poseidon-solidity/main)](https://dl.circleci.com/status-badge/redirect/gh/vimwitch/poseidon-solidity/tree/main)

PoseidonT3 (2 inputs) implementation in solidity over BN254.

**This implementation has not been audited.**

## Benchmark

```
Deploy cost
  - poseidon-solidity: 2,333,415 gas
  - circomlibjs opcodes: 2,156,516 gas

Hash cost
  - poseidon-solidity: 29,893 gas
  - circomlibjs opcodes: 32,173 gas
```

## Use

```sh
npm i poseidon-solidity
```

```solidity
import "poseidon-solidity/PoseidonT3.sol";

contract Example {
  function hashInput(uint input0, uint input1) public {
    PoseidonT3.hash([input0, input1]);
  }
}
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
