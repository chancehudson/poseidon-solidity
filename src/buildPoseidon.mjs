import fs from 'fs/promises'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const constantPath = path.join(__dirname, 'poseidon_constants.json')
const constants = JSON.parse((await fs.readFile(constantPath)).toString())

// generate the function

const ROUNDS_F = 8
const _ROUNDS_P = [
  56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68,
]
const F =
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'

const toHex = (n) => '0x' + BigInt(n).toString(16)

const buildMixSteps = (T) => {
  let f = ''
  for (let x = 0; x < T; x++) {
    const mem = x < 2 ? toHex(32 * x) : toHex(128 + 32 * (x - 2))
    f += `mstore(${mem}, `
    const addCount = T - 1
    for (let y = 0; y < addCount; y++) {
      f += `addmod(`
    }
    for (let y = 0; y < T; y++) {
      f += `mulmod(state${y}, M${y}${x}, F), `
      if (y === T - 1) {
        f += `F)`
        continue
      }
      if (y % 2 === 1) {
        f += `F)`
        if (y <= T - 1) {
          f += ', '
        }
      }
      if (y >= 1 && y % 2 === 0) {
        f += `F)`
        if (y <= T - 1) {
          f += ', '
        }
      }
    }
    f += `)\n`
  }
  return f
}

export function genTContract(T) {
  const C = constants.C[T - 2]
  const M = constants.M[T - 2]
  const ROUNDS_P = _ROUNDS_P[T - 2]

  let f = `/// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

library PoseidonT${T} {

uint constant F = ${F};

`

  for (let x = 0; x < T; x++) {
    for (let y = 0; y < T; y++) {
      f += `uint constant M${x}${y} = ${M[y][x]};\n`
    }
  }

  f += `

// See here for a simplified implementation: https://github.com/vimwitch/poseidon-solidity/blob/e57becdabb65d99fdc586fe1e1e09e7108202d53/contracts/Poseidon.sol#L40
// Based on: https://github.com/iden3/circomlibjs/blob/v0.0.8/src/poseidon_slow.js
function hash(uint[${T - 1}] memory inputs) public pure returns (uint) {
assembly {

// memory 0x00 to 0x3f (64 bytes) is scratch space for hash algos
// we can use it in inline assembly because we're not calling e.g. keccak
//
// memory 0x80 is the default offset for free memory
// we take inputs as a memory argument so we simply write over
// that memory after loading it

// we have the following variables at memory offsets
// state0 - 0x00
// state1 - 0x20
// state2 - 0x80
// state3 - 0xa0
// state4 - ...

function pRound(${Array(T)
    .fill(null)
    .map((_, i) => `c${i}`)
    .join(', ')}) {
`
  for (let x = 0; x < T; x++) {
    const mem = x < 2 ? toHex(32 * x) : toHex(128 + 32 * (x-2))
    f += `let state${x} := addmod(mload(${mem}), c${x}, F)\n`
  }

  f += `

  let p := mulmod(state0, state0, F)
  state0 := mulmod(mulmod(p, p, F), state0, F)

  ${buildMixSteps(T)}
}

function fRound(${Array(T)
    .fill(null)
    .map((_, i) => `c${i}`)
    .join(', ')}) {
`
  for (let x = 0; x < T; x++) {
    const mem = x < 2 ? toHex(32 * x) : toHex(128 + 32 * (x-2))
    f += `let state${x} := addmod(mload(${mem}), c${x}, F)\n`
  }

  f += '\n'

  for (let x = 0; x < T; x++) {
    f += `${x === 0 ? 'let ' : ''}p := mulmod(state${x}, state${x}, F)\n`
    f += `state${x} := mulmod(mulmod(p, p, F), state${x}, F)\n`
  }

  f += '\n'

  f += buildMixSteps(T)

  f += `
}

// we're assuming that 0x80 is usable as scratch memory
// make sure we're not overwriting another functions memory
if eq(eq(inputs, 0x80), 0) {
  revert(0, 0)
}

// scratch variable for exponentiation
let p
`

  let r = 0

  // pre-calculate the first state0 pow5mod
  // and the first mix values

  const state0 = BigInt(C[0]) ** BigInt(5) % BigInt(F)

  const SM = []
  for (let x = 0; x < T; x++) {
    SM[x] = (state0 * BigInt(M[x][0])) % BigInt(F)
  }

  f += `\n{\n`

  f += '// load the inputs from memory\n'

  for (let x = 1; x < T; x++) {
    const mem = toHex(128 + 32 * (x - 1))
    f += `let state${x} := addmod(mload(${mem}), ${C[r * T + x]}, F)\n`
  }

  f += '\n'

  for (let x = 1; x < T; x++) {
    f += `p := mulmod(state${x}, state${x}, F)\n`
    f += `state${x} := mulmod(mulmod(p, p, F), state${x}, F)\n`
  }
  f += `

  // state0 pow5mod and M[] multiplications are pre-calculated

`
  let precalcMix = buildMixSteps(T)
  for (let x = 0; x < T; x++) {
    precalcMix = precalcMix.replace(
      `mulmod(state0, M0${x}, F)`,
      '0x' + SM[x].toString(16)
    )
  }
  f += precalcMix
  f += `}\n`

  r++

  for (; r < ROUNDS_F + ROUNDS_P - 1; r++) {
    const func =
      r < ROUNDS_F / 2 || r >= ROUNDS_F / 2 + ROUNDS_P ? 'fRound' : 'pRound'
    f += `
${func}(`
    for (let x = 0; x < T; x++) {
      f += `${C[r * T + x]}${x === T - 1 ? '' : ','}\n`
    }
    f += `)
`
  }

  f += `\n{\n`

  for (let x = 0; x < T; x++) {
    const mem = x < 2 ? toHex(32 * x) : toHex(128 + 32 * (x-2))
    f += `let state${x} := addmod(mload(${mem}), ${C[r * T + x]}, F)\n`
  }

  f += '\n'

  for (let x = 0; x < T; x++) {
    f += `p := mulmod(state${x}, state${x}, F)\n`
    f += `state${x} := mulmod(mulmod(p, p, F), state${x}, F)\n`
  }
  const lastMix = buildMixSteps(T)
    .split('\n')[0]
    .replace('mstore(0x0, ', '')
    .slice(0, -1)

  f += `

  mstore(
    0,
    ${lastMix}
  )
  return(0, 0x20)
}
}
}
}
`

  return f
}
