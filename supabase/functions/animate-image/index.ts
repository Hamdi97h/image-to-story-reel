import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set');
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    const { imageBase64, prompt, duration } = await req.json();

    if (!imageBase64 || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Image and prompt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Starting image animation with prompt:', prompt);
    console.log('Image base64 length:', imageBase64.length);

    // Use a working image-to-video model
    console.log('Calling Replicate API with minimax video-01...');
    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          image: imageBase64,
          prompt: prompt
        }
      }
    );

    console.log('Video generation completed:', output);

    if (!output) {
      throw new Error('No output received from Replicate API');
    }

    return new Response(
      JSON.stringify({
        success: true,
        videoUrl: output,
        message: 'Vidéo animée générée avec succès!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in animate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: `Erreur lors de l'animation: ${error.message}`,
        details: 'Vérifiez que la clé API Replicate est correctement configurée.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});