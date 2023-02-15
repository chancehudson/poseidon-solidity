/// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import "hardhat/console.sol";

interface Poseidon2 {
  function poseidon(uint[1] calldata) external pure returns (uint);
}

interface _PoseidonT2 {
  function hash(uint[1] calldata) external pure returns (uint);
}

interface Poseidon3 {
  function poseidon(uint[2] calldata) external pure returns (uint);
}

interface _PoseidonT3 {
  function hash(uint[2] calldata) external pure returns (uint);
}

interface Poseidon4 {
  function poseidon(uint[3] calldata) external pure returns (uint);
}

interface _PoseidonT4 {
  function hash(uint[3] calldata) external pure returns (uint);
}

interface Poseidon5 {
  function poseidon(uint[4] calldata) external pure returns (uint);
}

interface _PoseidonT5 {
  function hash(uint[4] calldata) external pure returns (uint);
}

contract Test {
  // Benchmark poseidon-solidity
  function benchmarkA2(address p, uint[1] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = _PoseidonT2(p).hash(inputs);
    console.log(g-gasleft());
    return r;
  }

  // Benchmark circomlibjs
  function benchmarkB2(address p, uint[1] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = Poseidon2(p).poseidon(inputs);
    console.log(g-gasleft());
    return r;
  }
  // Benchmark poseidon-solidity
  function benchmarkA3(address p, uint[2] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = _PoseidonT3(p).hash(inputs);
    console.log(g-gasleft());
    return r;
  }

  // Benchmark circomlibjs
  function benchmarkB3(address p, uint[2] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = Poseidon3(p).poseidon(inputs);
    console.log(g-gasleft());
    return r;
  }
  // Benchmark poseidon-solidity
  function benchmarkA4(address p, uint[3] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = _PoseidonT4(p).hash(inputs);
    console.log(g-gasleft());
    return r;
  }

  // Benchmark circomlibjs
  function benchmarkB4(address p, uint[3] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = Poseidon4(p).poseidon(inputs);
    console.log(g-gasleft());
    return r;
  }
  // Benchmark poseidon-solidity
  function benchmarkA5(address p, uint[4] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = _PoseidonT5(p).hash(inputs);
    console.log(g-gasleft());
    return r;
  }

  // Benchmark circomlibjs
  function benchmarkB5(address p, uint[4] memory inputs) public view returns (uint) {
    uint g = gasleft();
    uint r = Poseidon5(p).poseidon(inputs);
    console.log(g-gasleft());
    return r;
  }
}
