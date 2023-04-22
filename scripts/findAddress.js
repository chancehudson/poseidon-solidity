const { rlpEncode } = require('@zoltu/rlp-encoder')
const { keccak256 }  = require('js-sha3')
const { ec: EllipticCurve } = require('elliptic')
const secp256k1 = new EllipticCurve('secp256k1')
const path = require('path')
const fs = require('fs').promises

const [,,contractName, startR] = process.argv

const { bytecode } = require(path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`))

// seems to give ~50% higher than the actual cost
const deploymentGas = Math.ceil((bytecode.length * 150) / 100000)*100000
const gasPrice = 100*10**9
const totalCost = (BigInt(deploymentGas) * BigInt(gasPrice)).toString()

let r = Number(startR ?? 0)
for (;;) {
  try {
  	const _r = r.toString().padStart(64,'3')
    const { contractAddress, signerAddress, signedEncodedTransaction } = addressForR(_r)
		if (r%1000===0) console.log(r)
		const prefix = `${''.padStart(3, contractName.slice(-1))}333`
		if (contractAddress.startsWith(prefix)) {
			const deploy = {
				address: `0x${contractAddress}`,
				from: `0x${signerAddress}`,
				gasLimit: deploymentGas,
				gasPrice,
				gas: totalCost,
				tx: `0x${signedEncodedTransaction}`
			}
			fs.writeFile(path.join(__dirname, `../deploy/${contractName}.json`), JSON.stringify(deploy, null, 2))
				.then(() => {
					console.log(`Destination: 0x${contractAddress}`)
					console.log(`✨ Wrote ${contractName}.json`)
					process.exit(0)
				})
				.catch(console.log)
	    break
		}
	} catch (_){}
	r++
}

function addressForR(_r) {
	const deploymentBytecode = bytecode.slice(2) // '0000' //contract.evm.bytecode.object

	const nonce = new Uint8Array(0)
	const _gasPrice = arrayFromNumber(gasPrice)
	const gasLimit = arrayFromNumber(deploymentGas)
	const to = new Uint8Array(0)
	const value = new Uint8Array(0)
	const data = arrayFromHexString(deploymentBytecode)
	const v = arrayFromNumber(27)
	const r = arrayFromHexString(_r)
	const s = arrayFromHexString('3333333333333333333333333333333333333333333333333333333333333333')

	const unsignedEncodedTransaction = rlpEncode([nonce, _gasPrice, gasLimit, to, value, data])
	const signedEncodedTransaction = rlpEncode([nonce, _gasPrice, gasLimit, to, value, data, v, r, s])
	const tx = signedEncodedTransaction.reduce((x,y)=>x+=y.toString(16).padStart(2, '0'), '')
	const hashedSignedEncodedTransaction = new Uint8Array(keccak256.arrayBuffer(unsignedEncodedTransaction))
	const signerAddress = arrayFromHexString(keccak256(secp256k1.recoverPubKey(hashedSignedEncodedTransaction, { r: r, s: s}, 0).encode('array').slice(1)).slice(-40))
	const contractAddress = arrayFromHexString(keccak256(rlpEncode([signerAddress, nonce])).slice(-40))
  return {
  	signedEncodedTransaction: tx,
  	contractAddress: contractAddress.reduce((x,y)=>x+=y.toString(16).padStart(2, '0'), ''),
  	signerAddress: signerAddress.reduce((x,y)=>x+=y.toString(16).padStart(2, '0'), '')
  }
}

function arrayFromNumber(value) {
	return arrayFromHexString(value.toString(16))
}

function arrayFromHexString(value) {
	const normalized = (value.length % 2) ? `0${value}` : value
	const bytes = []
	for (let i = 0; i < normalized.length; i += 2) {
		bytes.push(Number.parseInt(`${normalized[i]}${normalized[i+1]}`, 16))
	}
	return new Uint8Array(bytes)
}
