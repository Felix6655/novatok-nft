'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wallet, AlertCircle, RefreshCw, Plus, Loader2, ExternalLink, ImageIcon } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/components/Toast';
import { MOCK_NFTS, SEPOLIA_CHAIN_ID } from '@/lib/constants';
import { isContractConfigured, NFT_CONTRACT_ADDRESS, getOwnedNFTs } from '@/lib/web3/nft';
import { parseTokenUri } from '@/lib/metadata';

// Check if wallet connect is configured
const isWalletConnectConfigured = Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

export default function MyNFTsPage() {
  const { toast } = useToast();
  const account = isWalletConnectConfigured ? useAccount() : { address: null, isConnected: false };
  const chainId = isWalletConnectConfigured ? useChainId() : null;
  
  const { address, isConnected } = account;
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;
  
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [error, setError] = useState('');

  // Fetch NFTs from chain or show demo data
  const fetchNFTs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // If not configured or not connected properly, show demo data
      if (!isContractConfigured || !isWalletConnectConfigured || !isConnected || !isCorrectNetwork) {
        setIsDemo(true);
        setNfts(MOCK_NFTS.slice(0, 4).map((nft, idx) => ({
          ...nft,
          tokenId: String(idx + 1),
          isDemo: true,
        })));
        return;
      }
      
      // Fetch real NFTs from chain
      setIsDemo(false);
      const ownedNFTs = await getOwnedNFTs(address);
      
      // Parse metadata from tokenURIs
      const parsedNFTs = await Promise.all(
        ownedNFTs.map(async (nft) => {
          let metadata = parseTokenUri(nft.tokenURI);
          
          // If it's a URL, try to fetch it
          if (!metadata && nft.tokenURI && nft.tokenURI.startsWith('http')) {
            try {
              const response = await fetch(nft.tokenURI);
              metadata = await response.json();
            } catch (err) {
              console.error('Error fetching tokenURI:', err);
            }
          }
          
          return {
            id: nft.tokenId,
            tokenId: nft.tokenId,
            name: metadata?.name || `NFT #${nft.tokenId}`,
            description: metadata?.description || '',
            image: metadata?.image || '/placeholder-nft.png',
            tokenURI: nft.tokenURI,
            isDemo: false,
          };
        })
      );
      
      setNfts(parsedNFTs);
      
      if (parsedNFTs.length === 0) {
        toast.info('No NFTs found in your wallet');
      }
      
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to load NFTs. Please try again.');
      toast.error('Failed to load NFTs');
      
      // Fallback to demo data on error
      setIsDemo(true);
      setNfts(MOCK_NFTS.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, isCorrectNetwork, toast]);

  // Initial load
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const handleRefresh = () => {
    fetchNFTs();
    toast.info('Refreshing NFTs...');
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

        {/* Status Banners */}
        {!isWalletConnectConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to view your real NFTs.
              </p>
            </div>
          </GlassCard>
        )}
        
        {isWalletConnectConfigured && !isConnected && (
          <GlassCard className="p-4 mb-6 border-blue-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm">
                Connect your wallet to view your NFT collection.
              </p>
            </div>
          </GlassCard>
        )}
        
        {isWalletConnectConfigured && isConnected && !isCorrectNetwork && (
          <GlassCard className="p-4 mb-6 border-orange-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <p className="text-orange-300 text-sm">
                Please switch to Sepolia network to view your NFTs.
              </p>
            </div>
          </GlassCard>
        )}
        
        {!isContractConfigured && isWalletConnectConfigured && isConnected && isCorrectNetwork && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS to view real NFTs.
              </p>
            </div>
          </GlassCard>
        )}
        
        {isDemo && !isLoading && nfts.length > 0 && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Showing demo NFTs. Configure wallet and contract to view your real collection.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Error Display */}
        {error && (
          <GlassCard className="p-4 mb-6 border-red-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-gray-400">Loading your NFTs...</p>
          </div>
        )}

        {/* NFT Grid */}
        {!isLoading && nfts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} isDemo={nft.isDemo} />
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
              {isConnected 
                ? "You don't have any NFTs in this wallet yet"
                : 'Connect your wallet to view your NFTs, or create your first one'}
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

        {/* Contract Info */}
        {!isDemo && isContractConfigured && nfts.length > 0 && (
          <div className="mt-8 text-center">
            <a
              href={`https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View contract on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function NFTCard({ nft, isDemo }) {
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
        
        {isDemo && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-yellow-500/80 text-xs font-medium text-black">
            Demo
          </div>
        )}
        
        {!isDemo && nft.tokenId && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
            #{nft.tokenId}
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white truncate">{nft.name}</h3>
      
      {nft.description && (
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{nft.description}</p>
      )}
      
      <p className="text-sm text-gray-500 mt-2">
        {isDemo ? 'Demo NFT' : 'Owned by you'}
      </p>
    </GlassCard>
  );
}
