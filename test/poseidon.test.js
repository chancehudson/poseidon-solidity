const { ethers } = require('hardhat')
const { poseidon_slow, poseidon_gencontract } = require('circomlibjs')
const poseidon = require('poseidon-lite')
const assert = require('assert')
const T = require('../src/T')

const F_MAX =
  BigInt(
    '21888242871839275222246405745257275088548364400416034343698204186575808495617'
  ) - BigInt(1)

for (const t of T) {
  describe(`PoseidonT${t}`, function () {
    it('should hash elements', async () => {
      const [owner] = await ethers.getSigners()
      const Test = await ethers.getContractFactory('Test')
      const test = await Test.deploy()
      const Poseidon = await ethers.getContractFactory(`PoseidonT${t}`)
      const _poseidon = await Poseidon.deploy()
      console.log('soldity implementation:')
      const input = Array(t - 1)
        .fill()
        .map((_, i) => i + 1)
      const h = await test[`benchmarkA${t}`](_poseidon.address, input)
      assert.equal(h.toString(), poseidon_slow(input).toString())
      assert.equal(h.toString(), poseidon(input).toString())
    })
    if (t < 7) {
      it('should check against iden3 impl', async () => {
        const bytecode = poseidon_gencontract.createCode(t - 1)
        const abi = poseidon_gencontract.generateABI(t - 1)
        const [owner] = await ethers.getSigners()
        const Test = await ethers.getContractFactory('Test')
        const test = await Test.deploy()
        const f = new ethers.ContractFactory(abi, bytecode, owner)
        const c = await f.deploy()
        await c.deployed()
        console.log('iden3 implementation:')
        const input = Array(t - 1)
          .fill()
          .map((_, i) => i + 1)
        await test[`benchmarkB${t}`](c.address, input)
      })
    }

    it('should check many random elements', async () => {
      const [owner] = await ethers.getSigners()
      const Poseidon = await ethers.getContractFactory(`PoseidonT${t}`)
      const _poseidon = await Poseidon.deploy()
      for (let x = 0; x < 10; x++) {
        const input = Array(t - 1)
          .fill()
          .map(() => poseidon([Math.floor(Math.random() * 100000000)]))
        const h = await _poseidon.hash(input)
        assert.equal(h.toString(), poseidon(input).toString())
        assert.equal(h.toString(), poseidon_slow(input).toString())
      }
    })

    it('should correctly hash edge inputs', async () => {
      const [owner] = await ethers.getSigners()
      const Poseidon = await ethers.getContractFactory(`PoseidonT${t}`)
      const _poseidon = await Poseidon.deploy()
      {
        const input = Array(t - 1).fill(0)
        const h = await _poseidon.hash(input)
        assert.equal(h.toString(), poseidon(input).toString())
        assert.equal(h.toString(), poseidon_slow(input).toString())
      }
      {
        const input = Array(t - 1).fill(F_MAX)
        const h = await _poseidon.hash(input)
        assert.equal(h.toString(), poseidon(input).toString())
        assert.equal(h.toString(), poseidon_slow(input).toString())
      }
    })
  })
}
