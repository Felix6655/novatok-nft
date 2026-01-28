'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Loader2, Wand2, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

export default function CreatePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImages((prev) => [data.imageUrl, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = (imageUrl) => {
    // Navigate to mint page with the image URL
    const encodedUrl = encodeURIComponent(imageUrl);
    router.push(`/mint?image=${encodedUrl}`);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Create Hub
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Turn your ideas into unique NFT artwork with AI
          </p>
        </div>

        {/* Prompt Input */}
        <GlassCard className="p-6 mb-8" hover={false}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Describe your NFT artwork
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cosmic astronaut exploring a neon galaxy with floating crystals..."
              className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
            />
            
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
                  onClick={() => setGeneratedImages([])}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Prompt Suggestions */}
        <GlassCard className="p-6 mb-8" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Prompt Ideas
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Cyberpunk robot warrior',
              'Ethereal cosmic phoenix',
              'Neon city at night',
              'Abstract digital dreams',
              'Mystical forest spirit',
              'Futuristic space station',
            ].map((suggestion) => (
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
            <h3 className="text-xl font-semibold text-white">Generated Artwork</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <GlassCard key={index} className="p-4" hover={false}>
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <Image
                      src={imageUrl}
                      alt={`Generated artwork ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={() => handleMint(imageUrl)}
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
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <p className="text-xl text-gray-400">Your generated artwork will appear here</p>
            <p className="text-gray-500 mt-2">Enter a prompt and click Generate to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
