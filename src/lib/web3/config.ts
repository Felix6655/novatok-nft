export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;

export const NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

export const MARKETPLACE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as string;

export const IS_DEMO =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/* ---------- Explorer helpers ---------- */

export const txExplorer = (hash: string) =>
  `https://sepolia.etherscan.io/tx/${hash}`;

export const addressExplorer = (address: string) =>
  `https://sepolia.etherscan.io/address/${address}`;

export const tokenExplorer = (tokenId: string | number) =>
  `https://sepolia.etherscan.io/token/${NFT_CONTRACT_ADDRESS}?a=${tokenId}`;
