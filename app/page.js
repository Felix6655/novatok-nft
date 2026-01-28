'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Eye, Gem, Play, Music, Palette } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import NFTCard from '@/components/NFTCard';
import { MOCK_NFTS } from '@/lib/constants';

export default function HomePage() {
  const featuredNFTs = MOCK_NFTS.slice(0, 4);
  const marketplaceNFTs = MOCK_NFTS.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Create & Explore NFTs
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, generate, and trade NFTs on Ethereum Sepolia
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              <Sparkles className="w-5 h-5" />
              Generate NFT
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/20 hover:border-white/30"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Marketplace Preview */}
            <div className="lg:col-span-3 space-y-8">
              {/* First Marketplace Section */}
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    View Marketplace
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {featuredNFTs.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      compact
                      onBuy={() => alert(`Buying ${nft.name} - Coming Soon!`)}
                    />
                  ))}
                </div>
              </GlassCard>

              {/* Second Marketplace Section */}
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    View Marketplace
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {marketplaceNFTs.map((nft, index) => (
                    <NFTCard
                      key={`market-${nft.id}-${index}`}
                      nft={nft}
                      compact
                      onBuy={() => alert(`Buying ${nft.name} - Coming Soon!`)}
                    />
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Create NFTs Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create NFTs Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create NFTs</h2>
                <Link
                  href="/marketplace"
                  className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  View Marketplace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Generate Image Card */}
              <GlassCard className="p-5 relative overflow-hidden" hover={false}>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white">Generate Image</h3>
                  <p className="text-gray-400 mt-1">Turn your ideas into art with AI</p>
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
                  >
                    Generate
                  </Link>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 opacity-50">
                  <Image
                    src="https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=200&h=200&fit=crop"
                    alt="AI Art"
                    fill
                    className="object-cover rounded-bl-3xl"
                    unoptimized
                  />
                </div>
              </GlassCard>

              {/* Mint Your NFT Card */}
              <GlassCard className="p-5 relative overflow-hidden" hover={false}>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white">Mint Your NFT</h3>
                  <p className="text-gray-400 mt-1">Mint your unique NFT to the blockchain</p>
                  <Link
                    href="/mint"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all"
                  >
                    Mint Now
                  </Link>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 opacity-50">
                  <Image
                    src="https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=200&h=200&fit=crop"
                    alt="Mint NFT"
                    fill
                    className="object-cover rounded-bl-3xl"
                    unoptimized
                  />
                </div>
              </GlassCard>

              {/* More Coming Soon */}
              <GlassCard className="p-5" hover={false}>
                <h3 className="text-lg font-bold text-white">More Coming Soon</h3>
                <p className="text-gray-400 text-sm mt-1">We're building more</p>
                <div className="flex gap-3 mt-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Play className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Music className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </GlassCard>

              {/* My Assets */}
              <GlassCard className="p-5" hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">My Assets</h3>
                  <Link
                    href="/my-nfts"
                    className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    View Assets
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_NFTS.slice(0, 3).map((nft) => (
                    <div key={`asset-${nft.id}`} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
