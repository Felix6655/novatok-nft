'use client';

import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import NFTCard from '@/components/NFTCard';
import { MOCK_NFTS } from '@/lib/constants';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  const filteredNFTs = MOCK_NFTS.filter((nft) =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NFT Marketplace
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Discover and collect unique digital art on Sepolia
          </p>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-4 mb-8" hover={false}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 text-white transition-colors">
                <Filter className="w-5 h-5" />
                Filter
              </button>
              
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* NFT Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onBuy={() => alert(`Buying ${nft.name} - Coming Soon!`)}
            />
          ))}n        </div>

        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No NFTs found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
