import { ethers } from 'ethers'
import LENS_HUB_ABI from '~/api/abis/lens-hub-contract-abi.json'
import LENS_PERIPHERY_ABI from '~/api/abis/lens-periphery-data-provider.json'

export const lensHub = (signer: ethers.Signer) => new ethers.Contract(import.meta.env.VITE_APP_LENS_HUB_CONTRACT, LENS_HUB_ABI, signer)

export const lensPeriphery = (signer: ethers.Signer) =>
  new ethers.Contract(import.meta.env.VITE_APP_LENS_PERIPHERY_CONTRACT, LENS_PERIPHERY_ABI, signer)
