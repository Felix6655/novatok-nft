import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { REPLICATE_MODEL, MOCK_GENERATED_IMAGES } from '@/lib/constants';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;

    // If no API token, return a mock image for demo purposes
    if (!apiToken) {
      console.log('REPLICATE_API_TOKEN not set, returning mock image');
      const randomIndex = Math.floor(Math.random() * MOCK_GENERATED_IMAGES.length);
      return NextResponse.json({
        imageUrl: MOCK_GENERATED_IMAGES[randomIndex],
        mock: true,
        message: 'Mock image returned. Add REPLICATE_API_TOKEN for real AI generation.'
      });
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: apiToken,
    });

    // Run the SDXL model
    const output = await replicate.run(REPLICATE_MODEL, {
      input: {
        prompt: prompt,
        negative_prompt: 'blurry, bad quality, distorted, ugly',
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: 'K_EULER',
        num_inference_steps: 25,
        guidance_scale: 7.5,
        refine: 'expert_ensemble_refiner',
        high_noise_frac: 0.8,
      },
    });

    // SDXL returns an array of image URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error('No image URL returned from Replicate');
    }

    return NextResponse.json({
      imageUrl,
      mock: false
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a mock image on error for better UX
    const randomIndex = Math.floor(Math.random() * MOCK_GENERATED_IMAGES.length);
    return NextResponse.json({
      imageUrl: MOCK_GENERATED_IMAGES[randomIndex],
      mock: true,
      error: error.message,
      message: 'Fallback mock image returned due to error.'
    });
  }
}
