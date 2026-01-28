# NovaTok Explorer

A unified NFT Marketplace + AI Create Hub built on Ethereum Sepolia.

## Features

- 🎨 **AI Image Generation** - Create unique NFT artwork using Stability AI SDXL
- 🖼️ **NFT Marketplace** - Browse and discover NFTs on Sepolia
- ⛏️ **Minting** - Mint your AI-generated images as NFTs with on-chain metadata
- 👛 **Wallet Integration** - Connect via RainbowKit with Sepolia network support
- 🌌 **Cosmic UI** - Beautiful glass-morphism design with cosmic theme

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Web3**: RainbowKit, wagmi, viem
- **AI**: Replicate (Stability AI SDXL)
- **Network**: Ethereum Sepolia Testnet

## Getting Started

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# WalletConnect Project ID (required for wallet connection)
# Get yours at: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Replicate API Token (required for AI image generation)
# Get yours at: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=your_replicate_token_here

# NFT Contract Address on Sepolia (optional, for minting)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_contract_address_here

# Chain Configuration (optional, defaults to Sepolia)
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
```

## Pages

- **/** - Home page with marketplace preview and create hub
- **/marketplace** - Full NFT marketplace grid
- **/create** - AI image generation hub
- **/mint** - Mint NFTs with on-chain metadata
- **/my-nfts** - View your NFT collection

## Development Notes

### Without API Keys

The app works in demo mode without API keys:
- AI generation returns mock images
- Wallet connection shows a friendly warning
- Minting shows configuration requirements

### With API Keys

1. **WalletConnect**: Enables wallet connection and network switching
2. **Replicate**: Enables real AI image generation with SDXL
3. **Contract Address**: Enables actual NFT minting on Sepolia

## Deployment

Ready for Vercel deployment. Add environment variables in the Vercel dashboard.

```bash
vercel
```

## License

MIT
