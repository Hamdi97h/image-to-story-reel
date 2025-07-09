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

    // Add timeout wrapper for the Replicate API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 5 minutes')), 5 * 60 * 1000);
    });

    // Use Hailuo 2 for image animation (working model)
    const replicatePromise = replicate.run(
      "minimax/hailuo-02",
      {
        input: {
          image: imageBase64,
          prompt: prompt,
          duration: 6, // Use 6 seconds to avoid resolution constraints
          quality: "standard"
        }
      }
    );

    console.log('Waiting for Replicate API response...');
    const output = await Promise.race([replicatePromise, timeoutPromise]);

    console.log('Video generation completed:', output);

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