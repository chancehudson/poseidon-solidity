/// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import "hardhat/console.sol";

interface _PoseidonT3 {
  function poseidon(uint[2] calldata) external pure returns (uint);
}

contract Test {
  function benchmark(address p) public view returns (uint) {
    uint[2] memory input = [uint(2), 1];
    uint g = gasleft();
    uint r = _PoseidonT3(p).poseidon(input);
    console.log(g-gasleft());
    require(input[0] == 2, 'memcorrupt');
    require(input[1] == 1, 'memcorrupt');
    return r;
  }
}
