'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Gem, Loader2, Check, ExternalLink, AlertCircle, Upload } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

function MintContent() {
  const searchParams = useSearchParams();
  const imageFromQuery = searchParams.get('image');
  
  const [imageUrl, setImageUrl] = useState(imageFromQuery ? decodeURIComponent(imageFromQuery) : '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState(null);
  
  const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  const isContractConfigured = Boolean(contractAddress);

  const handleMint = async () => {
    if (!imageUrl) {
      alert('Please provide an image URL');
      return;
    }
    
    if (!isContractConfigured) {
      // Demo mode - simulate minting
      setIsMinting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMintTxHash('0x' + Math.random().toString(16).slice(2, 66));
      setMintedTokenId(Math.floor(Math.random() * 10000));
      setMintSuccess(true);
      setIsMinting(false);
      return;
    }
    
    // Real minting would go here when contract is configured
    alert('Connect wallet and configure contract address for real minting');
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

        {/* Configuration Warning */}
        {!isContractConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS for real minting. Currently simulating.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Success State */}
        {mintSuccess && mintTxHash && (
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
                <button
                  onClick={() => {
                    setMintSuccess(false);
                    setMintTxHash(null);
                    setImageUrl('');
                    setName('');
                    setDescription('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mint Another
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Mint Form */}
        {!mintSuccess && (
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

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={isMinting || !imageUrl}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Gem className="w-5 h-5" />
                    {isContractConfigured ? 'Mint NFT' : 'Mint NFT (Demo)'}
                  </>
                )}
              </button>
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
