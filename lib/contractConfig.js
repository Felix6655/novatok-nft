// Contract configuration
export const NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "";

export const isContractConfigured =
  NFT_CONTRACT_ADDRESS &&
  NFT_CONTRACT_ADDRESS.startsWith("0x") &&
  NFT_CONTRACT_ADDRESS.length === 42;
