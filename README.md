# NovaTok Explorer

A unified NFT Marketplace + AI Create Hub built on Ethereum Sepolia.

![NovaTok Explorer](https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=800&h=400&fit=crop)

## Features

- 🎨 **AI Image Generation** - Create unique NFT artwork using Stability AI SDXL via Replicate
- 🖼️ **NFT Marketplace** - Browse and discover NFTs on Sepolia
- ⛏️ **Minting** - Mint your AI-generated images as NFTs with on-chain base64 metadata
- 👛 **Wallet Integration** - Connect via RainbowKit with Sepolia network support
- 🌌 **Cosmic UI** - Beautiful glass-morphism design with cosmic theme
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
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

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ============================================
# WALLET CONNECTION (Required for Web3 features)
# ============================================
# WalletConnect Project ID
# Get yours at: https://cloud.walletconnect.com/
# 1. Sign up / Log in
# 2. Create a new project
# 3. Copy the Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# ============================================
# AI IMAGE GENERATION (Required for real AI)
# ============================================
# Replicate API Token
# Get yours at: https://replicate.com/account/api-tokens
# 1. Sign up / Log in
# 2. Go to Account Settings > API Tokens
# 3. Create a new token
REPLICATE_API_TOKEN=your_replicate_token_here

# ============================================
# NFT CONTRACT (Required for real minting)
# ============================================
# Your ERC721 NFT Contract Address on Sepolia
# Deploy your own or use an existing one
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x_your_contract_address_here

# ============================================
# CHAIN CONFIGURATION (Optional)
# ============================================
# Chain ID (default: 11155111 for Sepolia)
NEXT_PUBLIC_CHAIN_ID=11155111

# RPC URL (optional, uses public RPC by default)
# Get from Infura, Alchemy, or other providers
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/your_key
```

### Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | For Web3 | Enables wallet connection via RainbowKit |
| `REPLICATE_API_TOKEN` | For AI | Enables real AI image generation (SDXL) |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | For Minting | Your ERC721 contract on Sepolia |
| `NEXT_PUBLIC_CHAIN_ID` | Optional | Target chain ID (default: Sepolia) |
| `NEXT_PUBLIC_RPC_URL` | Optional | Custom RPC endpoint |

## Demo Mode

The app works in **Demo Mode** without any API keys:

- **AI Generation**: Returns sample placeholder images
- **Wallet Connection**: Shows disabled state with helpful message
- **Minting**: Simulates the minting process with fake tx hash
- **My NFTs**: Shows sample NFT collection

This allows you to explore the full UI and flow before setting up real integrations.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with marketplace preview and create hub |
| `/marketplace` | Full NFT marketplace grid with search |
| `/create` | AI image generation hub |
| `/mint` | Mint NFTs with on-chain metadata |
| `/my-nfts` | View your NFT collection |

## NFT Contract Requirements

For real minting, your ERC721 contract should implement:

```solidity
// Standard mint function
function mint(address to, string memory tokenURI) external returns (uint256);

// OR alternative safeMint
function safeMint(address to, string memory uri) external;
```

The app automatically tries `mint` first, then falls back to `safeMint`.

## Metadata Format

NFT metadata is stored on-chain as a base64-encoded data URI:

```
data:application/json;base64,{base64_encoded_json}
```

The JSON follows the standard NFT metadata format:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://...",
  "attributes": [
    { "trait_type": "Platform", "value": "NovaTok Explorer" },
    { "trait_type": "Created", "value": "2025-01-28" }
  ]
}
```

## API Routes

### POST `/api/ai/generate-image`

Generate AI images using Replicate SDXL.

**Request:**
```json
{
  "prompt": "A cosmic dragon in space",
  "aspect": "1:1",
  "seed": 12345
}
```

**Response:**
```json
{
  "demo": false,
  "images": ["https://replicate.delivery/..."]
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Image description (min 3 chars) |
| `aspect` | string | No | "1:1", "16:9", or "9:16" |
| `seed` | number | No | For reproducible results |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Project Settings
4. Deploy

```bash
vercel
```

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js:

- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

## Development

### Project Structure

```
/app
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── ai/            # AI generation endpoint
│   ├── create/            # Create page
│   ├── marketplace/       # Marketplace page
│   ├── mint/              # Mint page
│   ├── my-nfts/           # My NFTs page
│   └── page.js            # Home page
├── components/            # React components
│   ├── CosmicBackground.js
│   ├── GlassCard.js
│   ├── Navbar.js
│   ├── NFTCard.js
│   ├── Providers.js
│   └── Toast.js
├── lib/                   # Utilities and helpers
│   ├── web3/              # Web3 helpers
│   │   └── nft.js         # NFT contract interactions
│   ├── constants.js       # App constants
│   ├── metadata.js        # Metadata builder
│   └── web3Config.js      # Wagmi/RainbowKit config
└── public/                # Static assets
```

### Customization

- **AI Model**: Change `REPLICATE_MODEL` in `/lib/constants.js`
- **Theme Colors**: Modify Tailwind config and CSS variables
- **Chain**: Update chain configuration in `/lib/web3Config.js`

## License

MIT

## Support

For issues and feature requests, please open a GitHub issue.
