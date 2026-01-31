"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Loader2, Wand2, RefreshCw, Download, Trash2, AlertCircle, ImageIcon } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/components/Toast';
import { isContractConfigured } from "@/lib/web3/nft";

const STORAGE_KEY = 'novatok_generated_images';

const PROMPT_SUGGESTIONS = [
  'Cyberpunk robot warrior in neon city',
  'Ethereal cosmic phoenix rising from nebula',
  'Futuristic samurai with holographic armor',
  'Abstract digital dreamscape with fractals',
  'Mystical forest spirit with glowing eyes',
  'Steampunk dragon breathing golden fire',
];

export default function CreateClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  // Load persisted images from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setGeneratedImages(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading saved images:', err);
    }
  }, []);

  // Persist images to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(generatedImages));
    } catch (err) {
      console.error('Error saving images:', err);
    }
  }, [generatedImages]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      toast.warning('Please enter a prompt to generate an image');
      return;
    }

    if (prompt.trim().length < 3) {
      setError('Prompt must be at least 3 characters');
      toast.warning('Prompt is too short');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          aspect: aspect,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      // Handle new API response format (array of images)
      const newImages = data.images || [data.imageUrl];
      const imageObjects = newImages.map((url, idx) => ({
        id: `${Date.now()}-${idx}`,
        url,
        prompt: prompt.trim(),
        aspect,
        createdAt: new Date().toISOString(),
        demo: data.demo,
      }));

      setGeneratedImages((prev) => [...imageObjects, ...prev]);
      setIsDemo(data.demo);
      
      if (!isContractConfigured) {
        toast.info('Demo mode: Using sample images');
        setIsDemo(true);
      } else {
        toast.success('Image generated successfully!');
        setIsDemo(false);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = (imageUrl) => {
    const encodedUrl = encodeURIComponent(imageUrl);
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/mint?image=${encodedUrl}&prompt=${encodedPrompt}`);
  };

  const handleRemoveImage = (imageId) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
    toast.info('Image removed');
  };

  const handleClearAll = () => {
    setGeneratedImages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.info('All images cleared');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
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

        {/* Demo Banner */}
        {!isContractConfigured && (
          <GlassCard className="p-4 mb-6 border-yellow-500/30" hover={false}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">
                Demo Mode: Using sample images. Add REPLICATE_API_TOKEN for real AI generation.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Prompt Input */}
        <GlassCard className="p-6 mb-8" hover={false}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Describe your NFT artwork
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleGenerate();
                }
              }}
              placeholder="A cosmic astronaut exploring a neon galaxy with floating crystals..."
              className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
            />
            
            {/* Aspect Ratio Selection */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-gray-400">Aspect Ratio:</span>
              <div className="flex gap-2">
                {['1:1', '16:9', '9:16'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setAspect(option)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      aspect === option
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {generatedImages.map((img) => (
              <GlassCard key={img.id} className="p-4 flex flex-col items-center" hover={true}>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-white/5">
                  <Image
                    src={img.url}
                    alt={img.prompt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <p className="text-sm text-gray-300 truncate w-full" title={img.prompt}>{img.prompt}</p>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleMint(img.url)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium transition-all"
                    >
                      Mint NFT
                    </button>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 text-sm font-medium transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {generatedImages.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
