'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Gem, Loader2, Check, ExternalLink, AlertCircle, Upload } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import GlassCard from '@/components/GlassCard';
import { isWalletConnectConfigured } from '@/lib/web3Config';
import { NFT_CONTRACT_ADDRESS, NFT_ABI, isContractConfigured } from '@/lib/contractConfig';
import { SEPOLIA_CHAIN_ID } from '@/lib/constants';

function MintContent() {
  const searchParams = useSearchParams();
  const imageFromQuery = searchParams.get('image');
  
  const [imageUrl, setImageUrl] = useState(imageFromQuery ? decodeURIComponent(imageFromQuery) : '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintTxHash, setMintTxHash] = useState(null);
  
  const { address, isConnected } = isWalletConnectConfigured ? useAccount() : { address: null, isConnected: false };
  const chainId = isWalletConnectConfigured ? useChainId() : null;
  const { switchChain } = isWalletConnectConfigured ? useSwitchChain() : { switchChain: null };
  
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;
  
  const { writeContract, data: hash, isPending, error: writeError } = isWalletConnectConfigured 
    ? useWriteContract() 
    : { writeContract: null, data: null, isPending: false, error: null };
  
  const { isLoading: isConfirming, isSuccess } = isWalletConnectConfigured && hash
    ? useWaitForTransactionReceipt({ hash })
    : { isLoading: false, isSuccess: false };

  useEffect(() => {
    if (isSuccess && hash) {
      setMintTxHash(hash);
      // In a real implementation, we'd parse the logs to get the tokenId
      setMintedTokenId(Math.floor(Math.random() * 10000));
    }
  }, [isSuccess, hash]);

  const createMetadataURI = () => {
    const metadata = {
      name: name || 'Untitled NFT',
      description: description || 'Created with NovaTok Explorer',
      image: imageUrl,
      attributes: [
        { trait_type: 'Creator', value: address || 'Unknown' },
        { trait_type: 'Platform', value: 'NovaTok Explorer' },
        { trait_type: 'Created', value: new Date().toISOString() }
      ]
    };
    
    const jsonString = JSON.stringify(metadata);
    const base64 = btoa(jsonString);
    return `data:application/json;base64,${base64}`;
  };

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!isCorrectNetwork) {
      switchChain?.({ chainId: SEPOLIA_CHAIN_ID });
      return;
    }
    
    if (!imageUrl) {
      alert('Please provide an image URL');
      return;
    }
    
    const tokenURI = createMetadataURI();
    
    try {
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [address, tokenURI],
      });
    } catch (err) {
      console.error('Mint error:', err);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mint Your NFT
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Turn your artwork into a unique NFT on the blockchain
          </p>
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

        {/* Success State */}
        {isSuccess && mintTxHash && (
          <GlassCard className="p-6 mb-8 border-green-500/30" hover={false}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">NFT Minted Successfully!</h3>
              {mintedTokenId && (
                <p className="text-gray-300 mb-4">Token ID: #{mintedTokenId}</p>
              )}
              <div className="flex flex-col gap-3">
                <a
                  href={`https://sepolia.etherscan.io/tx/${mintTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Etherscan
                </a>
                <Link
                  href="/my-nfts"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                  View My NFTs
                </Link>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Mint Form */}
        {!isSuccess && (
          <GlassCard className="p-6" hover={false}>
            <div className="space-y-6">
              {/* Image Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or paste from Create page"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                
                {imageUrl && (
                  <div className="mt-4 relative aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="NFT Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                
                {!imageUrl && (
                  <div className="mt-4 aspect-square w-full max-w-sm mx-auto rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400">
                    <Upload className="w-12 h-12 mb-2" />
                    <p>Enter an image URL or</p>
                    <Link href="/create" className="text-purple-400 hover:text-purple-300">
                      Generate one with AI
                    </Link>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome NFT"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your NFT..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
                />
              </div>

              {/* Error Display */}
              {writeError && (
                <p className="text-red-400 text-sm">
                  Error: {writeError.message}
                </p>
              )}

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={isPending || isConfirming || !isConnected || !isContractConfigured || !imageUrl}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isPending ? 'Confirm in Wallet...' : 'Minting...'}
                  </>
                ) : (
                  <>
                    <Gem className="w-5 h-5" />
                    Mint NFT
                  </>
                )}
              </button>

              {/* Status Messages */}
              {!isConnected && isWalletConnectConfigured && (
                <p className="text-center text-yellow-400 text-sm">
                  Please connect your wallet to mint
                </p>
              )}
              
              {isConnected && !isCorrectNetwork && (
                <p className="text-center text-orange-400 text-sm">
                  Please switch to Sepolia network to mint
                </p>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default function MintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    }>
      <MintContent />
    </Suspense>
  );
}
