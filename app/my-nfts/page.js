'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Plus, Loader2, ImageIcon } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/components/Toast';
import { MOCK_NFTS } from '@/lib/constants';
import { isContractConfigured } from "@/lib/web3/nft";

export default function MyNFTsPage() {
  const { toast } = useToast();
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load NFTs based on contract config
  useEffect(() => {
    setIsLoading(true);
    if (!isContractConfigured) {
      // Demo Mode: show mock NFTs
      setTimeout(() => {
        setNfts(MOCK_NFTS.slice(0, 4).map((nft, idx) => ({
          ...nft,
          tokenId: String(idx + 1),
          isDemo: true,
        })));
        setIsLoading(false);
      }, 500);
    } else {
      // Real Mode: fetch from blockchain (placeholder)
      // TODO: Replace with actual blockchain fetch logic
      setTimeout(() => {
        setNfts([]);
        setIsLoading(false);
      }, 500);
    }
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    toast.info('Refreshing NFTs...');
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My NFTs
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Your collection of unique digital assets
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New
            </Link>
          </div>
        </div>

        {/* Demo Mode Banner */}
        {!isContractConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Showing sample NFTs. Add environment variables and connect wallet to view your real collection.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-gray-400">Loading NFTs...</p>
          </div>
        )}

        {/* NFT Grid */}
        {!isLoading && nfts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && nfts.length === 0 && (
          <GlassCard className="p-12 text-center" hover={false}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No NFTs Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first NFT with our AI tools
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First NFT
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
              >
                Explore Marketplace
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function NFTCard({ nft }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <GlassCard className="p-4 group" hover={true}>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/5">
        {!imageError ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-yellow-500/80 text-xs font-medium text-black">
          Demo
        </div>
        
        {nft.tokenId && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
            #{nft.tokenId}
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white truncate">{nft.name}</h3>
      <p className="text-sm text-gray-500 mt-2">Demo NFT</p>
    </GlassCard>
  );
}
