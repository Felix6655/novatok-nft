console.log("NFT_CONTRACT_ADDRESS:", NFT_CONTRACT_ADDRESS);
console.log("isContractConfigured:", isContractConfigured);
import { createPublicClient, http, parseAbiItem } from "viem";
import { sepolia } from "viem/chains";

// NFT Contract Configuration (support both env var names)

export const NFT_CONTRACT_ADDRESS =
  typeof process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS === "string" && process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS.trim().length > 0
    ? process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS.trim()
    : (typeof process.env.NEXT_PUBLIC_CONTRACT_ADDRESS === "string" && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.trim().length > 0
        ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.trim()
        : "");

export const isContractConfigured =
  typeof NFT_CONTRACT_ADDRESS === "string" &&
  NFT_CONTRACT_ADDRESS.startsWith("0x") &&
  NFT_CONTRACT_ADDRESS.length === 42;

// Get RPC URL from env or use default public endpoint
const getRpcUrl = () => {
  return (
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://ethereum-sepolia-rpc.publicnode.com"
  );
};

// Create a public client for reading from chain
export const getPublicClient = () => {
  return createPublicClient({
    chain: sepolia,
    transport: http(getRpcUrl()),
  });
};

// Minimal ERC721 ABI for reading and minting
export const NFT_ABI = [
  // Read functions
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // Mint function - standard
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI", type: "string" },
    ],
    name: "mint",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },

  // SafeMint function - alternative
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Transfer event for parsing tokenId from logs
export const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
);

/**
 * Read NFT balance for an address
 * @param {string} ownerAddress
 * @returns {Promise<bigint>}
 */
export async function getBalance(ownerAddress) {
  if (!isContractConfigured || !ownerAddress) return 0n;

  try {
    const client = getPublicClient();
    const balance = await client.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: "balanceOf",
      args: [ownerAddress],
    });
    return balance;
  } catch (error) {
    console.error("Error reading balance:", error);
    return 0n;
  }
}

/**
 * Get token ID at index for owner (ERC721Enumerable)
 * @param {string} ownerAddress
 * @param {number|bigint} index
 * @returns {Promise<bigint|null>}
 */
export async function getTokenOfOwnerByIndex(ownerAddress, index) {
  if (!isContractConfigured || !ownerAddress) return null;

  try {
    const client = getPublicClient();
    const tokenId = await client.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: "tokenOfOwnerByIndex",
      args: [ownerAddress, BigInt(index)],
    });
    return tokenId;
  } catch (error) {
    console.error("Error reading tokenOfOwnerByIndex:", error);
    return null;
  }
}

/**
 * Get tokenURI for a token
 * @param {string|number|bigint} tokenId
 * @returns {Promise<string|null>}
 */
export async function getTokenURI(tokenId) {
  if (!isContractConfigured || tokenId === null || tokenId === undefined)
    return null;

  try {
    const client = getPublicClient();
    const uri = await client.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });
    return uri;
  } catch (error) {
    console.error("Error reading tokenURI:", error);
    return null;
  }
}

/**
 * Get all NFTs owned by an address
 * Returns array of { tokenId, tokenURI }
 * @param {string} ownerAddress
 * @returns {Promise<Array<{tokenId: string, tokenURI: string}>>}
 */
export async function getOwnedNFTs(ownerAddress) {
  if (!isContractConfigured || !ownerAddress) return [];

  try {
    const balance = await getBalance(ownerAddress);
    const nfts = [];

    for (let i = 0n; i < balance; i++) {
      try {
        const tokenId = await getTokenOfOwnerByIndex(ownerAddress, i);
        if (tokenId !== null) {
          const tokenURI = await getTokenURI(tokenId);
          nfts.push({
            tokenId: tokenId.toString(),
            tokenURI: tokenURI || "",
          });
        }
      } catch (err) {
        console.error(`Error fetching token at index ${i}:`, err);
      }
    }

    return nfts;
  } catch (error) {
    console.error("Error getting owned NFTs:", error);
    return [];
  }
}

/**
 * Parse tokenId from transaction receipt logs
 * @param {any} receipt
 * @returns {string|null}
 */
export function parseTokenIdFromReceipt(receipt) {
  if (!receipt?.logs) return null;

  try {
    const TRANSFER_TOPIC =
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

    for (const log of receipt.logs) {
      if (log?.topics?.[0] === TRANSFER_TOPIC) {
        if (log.topics[3]) {
          return BigInt(log.topics[3]).toString();
        }
      }
    }
  } catch (error) {
    console.error("Error parsing tokenId from receipt:", error);
  }

  return null;
}
