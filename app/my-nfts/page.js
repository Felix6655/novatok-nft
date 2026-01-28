'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wallet, AlertCircle, Loader2, RefreshCw, Plus } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import GlassCard from '@/components/GlassCard';
import { isWalletConnectConfigured } from '@/lib/web3Config';
import { isContractConfigured } from '@/lib/contractConfig';
import { SEPOLIA_CHAIN_ID, MOCK_NFTS } from '@/lib/constants';

export default function MyNFTsPage() {
  const { address, isConnected } = isWalletConnectConfigured ? useAccount() : { address: null, isConnected: false };
  const chainId = isWalletConnectConfigured ? useChainId() : null;
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  // For demo purposes, show mock NFTs
  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      // In a real app, we'd fetch from the contract
      // For now, show a subset of mock NFTs as "owned"
      setNfts(MOCK_NFTS.slice(0, 3).map(nft => ({
        ...nft,
        owner: address
      })));
    } else {
      setNfts([]);
    }
  }, [isConnected, isCorrectNetwork, address]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
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

        {/* Configuration Warnings */}
        {!isWalletConnectConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                WalletConnect is not configured. Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your environment.
              </p>
            </div>
          </GlassCard>
        )}
        
        {!isContractConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                NFT Contract is not configured. Add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS to your environment.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Not Connected State */}
        {!isConnected && isWalletConnectConfigured && (
          <GlassCard className="p-12 text-center" hover={false}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect your wallet to view your NFT collection</p>
          </GlassCard>
        )}

        {/* Wrong Network */}
        {isConnected && !isCorrectNetwork && (
          <GlassCard className="p-12 text-center" hover={false}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wrong Network</h3>
            <p className="text-gray-400 mb-6">Please switch to Sepolia network to view your NFTs</p>
          </GlassCard>
        )}

        {/* NFT Grid */}
        {isConnected && isCorrectNetwork && (
          <>
            {nfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <GlassCard key={nft.id} className="p-4" hover={true}>
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
                    <p className="text-sm text-gray-400 truncate">Owned by you</p>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-12 text-center" hover={false}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Plus className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No NFTs Yet</h3>
                <p className="text-gray-400 mb-6">Create your first NFT with our AI tools</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First NFT
                </Link>
              </GlassCard>
            )}
          </>
        )}

        {/* Demo Notice */}
        {isConnected && isCorrectNetwork && nfts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Demo mode: Showing mock NFTs. Real NFTs will display once the contract is configured.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
