export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { REPLICATE_MODEL, ASPECT_RATIOS, DEMO_IMAGES } from '@/lib/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, aspect = '1:1', seed } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required', demo: false },
        { status: 400 }
      );
    }

    if (prompt.trim().length < 3) {
      return NextResponse.json(
        { error: 'Prompt must be at least 3 characters', demo: false },
        { status: 400 }
      );
    }

    // Validate aspect ratio
    const validAspects = ['1:1', '16:9', '9:16'];
    const selectedAspect = validAspects.includes(aspect) ? aspect : '1:1';
    const dimensions = ASPECT_RATIOS[selectedAspect];

    const apiToken = process.env.REPLICATE_API_TOKEN;

    // Demo mode - return mock images when no API token
    if (!apiToken) {
      console.log('REPLICATE_API_TOKEN not set, returning demo images');
      
      // Return multiple random demo images
      const shuffled = [...DEMO_IMAGES].sort(() => Math.random() - 0.5);
      const demoResults = shuffled.slice(0, 3);
      
      return NextResponse.json({
        demo: true,
        images: demoResults,
        message: 'Demo mode: Add REPLICATE_API_TOKEN for real AI generation.'
      });
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: apiToken,
    });

    // Build input parameters
    const input = {
      prompt: prompt.trim(),
      negative_prompt: 'blurry, bad quality, distorted, ugly, low resolution, watermark, text',
      width: dimensions.width,
      height: dimensions.height,
      num_outputs: 1,
      scheduler: 'K_EULER',
      num_inference_steps: 30,
      guidance_scale: 7.5,
      refine: 'expert_ensemble_refiner',
      high_noise_frac: 0.8,
    };

    // Add seed if provided for reproducibility
    if (typeof seed === 'number') {
      input.seed = seed;
    }

    console.log('Generating image with Replicate:', { prompt: prompt.trim(), aspect: selectedAspect });

    // Run the SDXL model
    const output = await replicate.run(REPLICATE_MODEL, { input });

    // SDXL returns an array of image URLs
    const images = Array.isArray(output) ? output : [output];

    if (!images.length || !images[0]) {
      throw new Error('No image URL returned from Replicate');
    }

    return NextResponse.json({
      demo: false,
      images: images,
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return demo images on error for better UX
    const shuffled = [...DEMO_IMAGES].sort(() => Math.random() - 0.5);
    const fallbackImages = shuffled.slice(0, 2);
    
    return NextResponse.json({
      demo: true,
      images: fallbackImages,
      error: error.message,
      message: 'Fallback to demo images due to generation error.'
    }, { status: 200 }); // Return 200 so UI still works
  }
}
