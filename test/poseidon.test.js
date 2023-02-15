const { ethers } = require('hardhat')
const { poseidon_slow, poseidon_gencontract } = require('circomlibjs')
const poseidon = require('poseidon-lite')
const assert = require('assert')

const F_MAX = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617') - BigInt(1)

describe('PoseidonT3', function () {

  it('should hash elements', async () => {
    const [owner] = await ethers.getSigners()
    const Test = await ethers.getContractFactory('Test')
    const test = await Test.deploy()
    const Poseidon = await ethers.getContractFactory('PoseidonT3')
    const _poseidon = await Poseidon.deploy()
    console.log('soldity implementation:')
    const h = await test.benchmarkA(_poseidon.address)
    assert.equal(h.toString(), poseidon([2, 1]).toString())
    assert.equal(h.toString(), poseidon_slow([2, 1]).toString())
  })

  it('should check against iden3 impl', async () => {
    const bytecode = poseidon_gencontract.createCode(2)
    const abi = poseidon_gencontract.generateABI(2)
    const [owner] = await ethers.getSigners()
    const Test = await ethers.getContractFactory('Test')
    const test = await Test.deploy()
    const f = new ethers.ContractFactory(abi, bytecode, owner)
    const c = await f.deploy()
    await c.deployed()
    console.log('iden3 implementation:')
    await test.benchmarkB(c.address)
  })

  it('should check many random elements', async () => {
    const [owner] = await ethers.getSigners()
    const Poseidon = await ethers.getContractFactory('PoseidonT3')
    const _poseidon = await Poseidon.deploy()
    for (let x = 0; x < 10; x++) {
      const i0 = poseidon([Math.floor(Math.random() * 100000000)])
      const i1 = poseidon([Math.floor(Math.random() * 100000000)])
      const h = await _poseidon.hash([i0,i1])
      assert.equal(h.toString(), poseidon([i0, i1]).toString())
      assert.equal(h.toString(), poseidon_slow([i0, i1]).toString())
    }
  })

  it('should correctly hash edge inputs', async () => {
    const [owner] = await ethers.getSigners()
    const Poseidon = await ethers.getContractFactory('PoseidonT3')
    const _poseidon = await Poseidon.deploy()
    {
      const h = await _poseidon.hash([0,0])
      assert.equal(h.toString(), poseidon([0, 0]).toString())
      assert.equal(h.toString(), poseidon_slow([0, 0]).toString())
    }
    {
      const h = await _poseidon.hash([F_MAX,F_MAX])
      assert.equal(h.toString(), poseidon([F_MAX, F_MAX]).toString())
      assert.equal(h.toString(), poseidon_slow([F_MAX, F_MAX]).toString())
    }
    {
      const h = await _poseidon.hash([0,F_MAX])
      assert.equal(h.toString(), poseidon([0, F_MAX]).toString())
      assert.equal(h.toString(), poseidon_slow([0, F_MAX]).toString())
    }
    {
      const h = await _poseidon.hash([F_MAX,0])
      assert.equal(h.toString(), poseidon([F_MAX, 0]).toString())
      assert.equal(h.toString(), poseidon_slow([F_MAX, 0]).toString())
    }
  })
})
