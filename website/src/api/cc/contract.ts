import { ethers } from 'ethers';
import CC_PROFILE_NFT from '~/api/abis/cc-profile-nft-contract.json';
const CC_CONTRACT = import.meta.env.VITE_APP_CYBERCONNECT_PROFILE_CONTRACT

export const getCCProfileNFTContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner();
  return new ethers.Contract(CC_CONTRACT, CC_PROFILE_NFT, signer);
}
