'use client';

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

const ASPECT_OPTIONS = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
];

export default function CreatePage() {
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
      
      // Demo mode for AI is still based on REPLICATE_API_TOKEN, but banner should only show if !isContractConfigured
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
    router.push(`/mint?image=${encodedUrl}`);
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
                {ASPECT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAspect(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      aspect === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
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
