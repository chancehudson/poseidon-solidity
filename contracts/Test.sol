/// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import "hardhat/console.sol";

interface Poseidon {
  function poseidon(uint[2] calldata) external pure returns (uint);
}

interface _PoseidonT3 {
  function hash(uint[2] calldata) external pure returns (uint);
}

contract Test {
  // Benchmark poseidon-solidity
  function benchmarkA(address p) public view returns (uint) {
    uint[2] memory input = [uint(2), 1];
    uint g = gasleft();
    uint r = _PoseidonT3(p).hash(input);
    console.log(g-gasleft());
    require(input[0] == 2, 'memcorrupt');
    require(input[1] == 1, 'memcorrupt');
    return r;
  }

  // Benchmark circomlibjs
  function benchmarkB(address p) public view returns (uint) {
    uint[2] memory input = [uint(2), 1];
    uint g = gasleft();
    uint r = Poseidon(p).poseidon(input);
    console.log(g-gasleft());
    require(input[0] == 2, 'memcorrupt');
    require(input[1] == 1, 'memcorrupt');
    return r;
  }
}
