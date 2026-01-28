'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Gem, Loader2, Check, ExternalLink, AlertCircle, Upload, RefreshCw, Wallet } from 'lucide-react';
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/components/Toast';
import { buildTokenUri } from '@/lib/metadata';
import { NFT_CONTRACT_ADDRESS, NFT_ABI, isContractConfigured, parseTokenIdFromReceipt } from '@/lib/web3/nft';
import { SEPOLIA_CHAIN_ID } from '@/lib/constants';

// Check if wallet connect is configured
const isWalletConnectConfigured = Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

function MintContent() {
  const searchParams = useSearchParams();
  const imageFromQuery = searchParams.get('image');
  const { toast } = useToast();
  
  const [imageUrl, setImageUrl] = useState(imageFromQuery ? decodeURIComponent(imageFromQuery) : '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintError, setMintError] = useState('');
  
  // Wallet hooks - only use if configured
  const account = isWalletConnectConfigured ? useAccount() : { address: null, isConnected: false };
  const chainId = isWalletConnectConfigured ? useChainId() : null;
  const switchChainHook = isWalletConnectConfigured ? useSwitchChain() : { switchChain: null };
  const writeContractHook = isWalletConnectConfigured ? useWriteContract() : { 
    writeContract: null, 
    data: null, 
    isPending: false, 
    error: null,
    reset: () => {}
  };
  
  const { address, isConnected } = account;
  const { switchChain } = switchChainHook;
  const { writeContract, data: txHash, isPending: isWritePending, error: writeError, reset: resetWrite } = writeContractHook;
  
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;
  
  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isTxSuccess, data: txReceipt } = 
    isWalletConnectConfigured && txHash 
      ? useWaitForTransactionReceipt({ hash: txHash })
      : { isLoading: false, isSuccess: false, data: null };

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess && txHash) {
      setMintTxHash(txHash);
      setMintSuccess(true);
      setIsMinting(false);
      
      // Try to parse tokenId from receipt
      if (txReceipt) {
        const tokenId = parseTokenIdFromReceipt(txReceipt);
        if (tokenId) {
          setMintedTokenId(tokenId);
        }
      }
      
      toast.success('NFT minted successfully!');
    }
  }, [isTxSuccess, txHash, txReceipt, toast]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setIsMinting(false);
      const errorMessage = writeError.message?.includes('User rejected') 
        ? 'Transaction rejected by user'
        : writeError.message || 'Minting failed';
      setMintError(errorMessage);
      toast.error(errorMessage);
    }
  }, [writeError, toast]);

  const handleDemoMint = async () => {
    setIsMinting(true);
    setMintError('');
    
    // Simulate minting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate fake tx hash and token ID
    const fakeTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const fakeTokenId = Math.floor(Math.random() * 10000);
    
    setMintTxHash(fakeTxHash);
    setMintedTokenId(fakeTokenId);
    setMintSuccess(true);
    setIsMinting(false);
    
    toast.success('NFT minted successfully! (Demo)');
  };

  const handleRealMint = async () => {
    if (!isConnected) {
      toast.warning('Please connect your wallet first');
      return;
    }
    
    if (!isCorrectNetwork) {
      toast.warning('Please switch to Sepolia network');
      switchChain?.({ chainId: SEPOLIA_CHAIN_ID });
      return;
    }
    
    if (!imageUrl) {
      toast.warning('Please provide an image URL');
      return;
    }
    
    setIsMinting(true);
    setMintError('');
    
    try {
      // Build the tokenURI with metadata
      const tokenURI = buildTokenUri({
        name: name || 'NovaTok NFT',
        description: description || 'Created with NovaTok Explorer',
        image: imageUrl,
      });
      
      // Try minting with 'mint' function first
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [address, tokenURI],
      });
      
    } catch (err) {
      console.error('Mint error:', err);
      setMintError(err.message || 'Minting failed');
      setIsMinting(false);
      toast.error('Minting failed');
    }
  };

  const handleMint = async () => {
    if (!imageUrl) {
      toast.warning('Please provide an image URL');
      return;
    }
    
    // If contract is not configured or wallet not connected, use demo mode
    if (!isContractConfigured || !isWalletConnectConfigured || !isConnected) {
      return handleDemoMint();
    }
    
    return handleRealMint();
  };

  const resetForm = () => {
    setMintSuccess(false);
    setMintTxHash(null);
    setMintedTokenId(null);
    setImageUrl('');
    setName('');
    setDescription('');
    setMintError('');
    resetWrite?.();
  };

  const isLoading = isMinting || isWritePending || isConfirming;

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
        {!isContractConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS for real minting on Sepolia.
              </p>
            </div>
          </GlassCard>
        )}
        
        {isContractConfigured && !isWalletConnectConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable wallet connection.
              </p>
            </div>
          </GlassCard>
        )}
        
        {isContractConfigured && isWalletConnectConfigured && !isConnected && (
          <GlassCard className="p-4 mb-6 border-blue-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm">
                Connect your wallet to mint real NFTs on Sepolia. Demo mint available without wallet.
              </p>
            </div>
          </GlassCard>
        )}
        
        {isContractConfigured && isWalletConnectConfigured && isConnected && !isCorrectNetwork && (
          <GlassCard className="p-4 mb-6 border-orange-500/30" hover={false}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <p className="text-orange-300 text-sm">
                  Please switch to Sepolia network to mint.
                </p>
              </div>
              <button
                onClick={() => switchChain?.({ chainId: SEPOLIA_CHAIN_ID })}
                className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-sm font-medium transition-colors"
              >
                Switch Network
              </button>
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
                <p className="text-gray-300 mb-2">Token ID: #{mintedTokenId}</p>
              )}
              <p className="text-gray-400 text-sm mb-4 font-mono break-all">
                Tx: {mintTxHash.slice(0, 10)}...{mintTxHash.slice(-8)}
              </p>
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
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
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
                  Image URL *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or paste from Create page"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                
                {imageUrl && (
                  <div className="mt-4 relative aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-white/10">
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
              {mintError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 text-sm">{mintError}</p>
                </div>
              )}

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={isLoading || !imageUrl}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isWritePending ? 'Confirm in Wallet...' : isConfirming ? 'Confirming...' : 'Minting...'}
                  </>
                ) : (
                  <>
                    <Gem className="w-5 h-5" />
                    {isContractConfigured && isConnected && isCorrectNetwork ? 'Mint NFT' : 'Mint NFT (Demo)'}
                  </>
                )}
              </button>
              
              {/* Info text */}
              <p className="text-xs text-gray-500 text-center">
                {isContractConfigured && isConnected && isCorrectNetwork 
                  ? 'This will mint your NFT on Ethereum Sepolia testnet'
                  : 'Demo mode simulates the minting process'}
              </p>
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
