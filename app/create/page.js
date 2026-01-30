'use client';

import { useState } from 'react';

export default function CreatePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImages(['demo']);
    }, 1500);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create</h1>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {generatedImages.length > 0 && (
        <p className="mt-4 text-green-400">
          Image generated successfully
        </p>
      )}
    </div>
  );
}
