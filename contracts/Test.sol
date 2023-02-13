/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface PoseidonT3 {
  function poseidon(uint[2] memory) external pure returns (uint);
}

contract Test {
  function benchmark(address p) public view returns (uint) {
    uint g = gasleft();
    uint r = PoseidonT3(p).poseidon([uint(2), 1]);
    console.log(g-gasleft());
    return r;
  }
}
