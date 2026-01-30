'use client';

import { useState, useEffect } from 'react';
export default function CreatePage() {
  return (
    <div>Client-only placeholder. Replace with your UI.</div>
  );
}

// The rest of the original content is removed for clarity.

// Original content starts here
// (This is where the original content would continue if needed)
'use client';

import { useState, useEffect } from 'react';
                ))}
              </div>
            </div>
            
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>
              
              {generatedImages.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 transition-colors"
                  title="Clear all images"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-500">
              Tip: Press Ctrl+Enter to generate
            </p>
          </div>
        </GlassCard>

        {/* Prompt Suggestions */}
        <GlassCard className="p-6 mb-8" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Prompt Ideas
          </h3>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500 text-sm text-gray-300 hover:text-white transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Generated Images Grid */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Generated Artwork ({generatedImages.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <GlassCard key={image.id} className="p-4 group" hover={false}>
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <Image
                      src={image.url}
                      alt={image.prompt || 'Generated artwork'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {image.demo && (
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-yellow-500/80 text-xs font-medium text-black">
                        Demo
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {image.prompt && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{image.prompt}</p>
                  )}
                  
                  <button
                    onClick={() => handleMint(image.url)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Mint as NFT
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedImages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-purple-400" />
            </div>
            <p className="text-xl text-gray-400">Your generated artwork will appear here</p>
            <p className="text-gray-500 mt-2">Enter a prompt and click Generate to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
