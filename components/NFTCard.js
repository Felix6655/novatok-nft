'use client';

import Image from 'next/image';
import { Gem } from 'lucide-react';

export default function NFTCard({ nft, onBuy, onMint, compact = false }) {
  return (
    <div className={`group relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 ${compact ? 'p-2' : 'p-3'}`}>
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className={`${compact ? 'mt-2' : 'mt-3'}`}>
        <h3 className={`font-semibold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
          {nft.name}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Gem className={`text-cyan-400 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={`text-cyan-300 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
              {nft.price} ETH
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <button
              disabled
              className={`px-3 py-1 rounded-lg bg-white/10 text-white font-medium transition-all border border-white/20 opacity-50 cursor-not-allowed ${compact ? 'text-xs' : 'text-sm'}`}
            >
              Buy Now
            </button>
            <p className="text-xs text-gray-400 mt-1">
              Listings coming soon
            </p>
          </div>
          
          {onMint && (
            <button
              onClick={() => onMint(nft)}
              className={`px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all ${compact ? 'text-xs' : 'text-sm'}`}
            >
              Mint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
