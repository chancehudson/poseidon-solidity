import { genTContract } from './buildPoseidon.mjs'
import prettier from 'prettier'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import T from './T.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

for (const t of T) {
  // const c = genTContract(t)
  const c = prettier.format(genTContract(t), {
    parser: 'solidity-parse',
    printWidth: 180,
    tabWidth: 2,
    useTabs: false,
    singleQuote: false,
    bracketSpacing: false,
  })
  await fs.writeFile(path.join(__dirname, `../contracts/PoseidonT${t}.sol`), c)
}
