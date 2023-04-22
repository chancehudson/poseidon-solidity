# poseidon-solidity [![CircleCI](https://img.shields.io/circleci/build/github/vimwitch/poseidon-solidity/main)](https://dl.circleci.com/status-badge/redirect/gh/vimwitch/poseidon-solidity/tree/main)

Poseidon implementation in Solidity over alt_bn128 (aka BN254).

**This implementation has not been audited.**

## Benchmark

```yaml
T2 hash
  - poseidon-solidity: 13,488 gas
  - circomlibjs: 19,395 gas

T3 hash
  - poseidon-solidity: 21,124 gas
  - circomlibjs: 32,173 gas

T4 hash
  - poseidon-solidity: 37,643 gas
  - circomlibjs: 48,267 gas

T5 hash
  - poseidon-solidity: 54,352 gas
  - circomlibjs: 73,307 gas

T6 hash
  - poseidon-solidity: 74,065 gas
  - circomlibjs: 100,197 gas

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
