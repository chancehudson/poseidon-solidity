const { ethers } = require('hardhat')
const { poseidon_slow, poseidon_gencontract } = require('circomlibjs')
const poseidon = require('poseidon-lite')
const assert = require('assert')

describe('Poseidon', function () {

  it('should hash elements', async () => {
    const [owner] = await ethers.getSigners()
    const Poseidon = await ethers.getContractFactory('Poseidon')
    const _poseidon = await Poseidon.deploy()
    const h = await _poseidon.hashBenchmark([2,1])
    assert.equal(h.toString(), poseidon([2, 1]).toString())
    assert.equal(h.toString(), poseidon_slow([2, 1]).toString())
  })

  it('should check against iden3 impl', async () => {
    const bytecode = poseidon_gencontract.createCode(2)
    const abi = poseidon_gencontract.generateABI(2)
    const [owner] = await ethers.getSigners()
    const Poseidon = await ethers.getContractFactory('Poseidon')
    const _poseidon = await Poseidon.deploy()
    const f = new ethers.ContractFactory(abi, bytecode, owner)
    const c = await f.deploy()
    await c.deployed()
    await _poseidon.extBenchmark(c.address)
  })

  it('should check many random elements', async () => {
    const [owner] = await ethers.getSigners()
    const Poseidon = await ethers.getContractFactory('Poseidon')
    const _poseidon = await Poseidon.deploy()
    for (let x = 0; x < 10; x++) {
      const i0 = Math.floor(Math.random() * 100000000)
      const i1 = Math.floor(Math.random() * 100000000)
      const h = await _poseidon.hash([i0,i1])
      assert.equal(h.toString(), poseidon([i0, i1]).toString())
      assert.equal(h.toString(), poseidon_slow([i0, i1]).toString())
    }
  })
})
