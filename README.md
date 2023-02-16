# poseidon-solidity [![CircleCI](https://img.shields.io/circleci/build/github/vimwitch/poseidon-solidity/main)](https://dl.circleci.com/status-badge/redirect/gh/vimwitch/poseidon-solidity/tree/main)

Poseidon implementation in Solidity over BN254.

**This implementation has not been audited.**

## Benchmark

```
Deploy cost (T3)
  - poseidon-solidity: 2,333,415 gas
  - circomlibjs: 2,156,516 gas

Hash cost (T2)
  - poseidon-solidity: 18,614 gas
  - circomlibjs: 19,395 gas

Hash cost (T3)
  - poseidon-solidity: 29,893 gas
  - circomlibjs: 32,173 gas

Hash cost (T4)
  - poseidon-solidity: 43,696 gas
  - circomlibjs: 48,267 gas

Hash cost (T5)
  - poseidon-solidity: 65,085 gas
  - circomlibjs: 73,307 gas

Hash cost (T6)
  - poseidon-solidity: 94,583 gas
  - circomlibjs: 10,0197 gas
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
