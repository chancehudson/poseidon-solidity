type PresignedDeploy = {
  address: string
  from: string
  gasLimit: number
  gasPrice: number
  gas: string
  tx: string
}

declare module 'poseidon-solidity' {
  export const PoseidonT2: PresignedDeploy
  export const PoseidonT3: PresignedDeploy
  export const PoseidonT4: PresignedDeploy
  export const PoseidonT5: PresignedDeploy
  export const PoseidonT6: PresignedDeploy
}
