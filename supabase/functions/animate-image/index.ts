import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RUNPOD_API_KEY = Deno.env.get('RUNPOD_API_KEY');
    if (!RUNPOD_API_KEY) {
      throw new Error('RUNPOD_API_KEY is not set');
    }

    const { imageBase64, prompt, duration = 10 } = await req.json();

    if (!imageBase64 || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Image and prompt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Starting video generation with RunPod:', prompt);
    console.log('Image base64 length:', imageBase64.length);

    // Call RunPod API for video generation
    console.log('Calling RunPod API...');
    const runpodResponse = await fetch('https://api.runpod.ai/v2/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          image: imageBase64,
          prompt: prompt,
          duration: duration,
          model: "stable-video-diffusion",
          resolution: "1024x576",
          fps: 24
        }
      })
    });

    if (!runpodResponse.ok) {
      const errorText = await runpodResponse.text();
      console.error('RunPod API error:', errorText);
      throw new Error(`RunPod API error: ${runpodResponse.status} ${errorText}`);
    }

    const output = await runpodResponse.json();
    console.log('Video generation completed:', output);
    console.log('Output structure:', JSON.stringify(output, null, 2));

    if (!output) {
      throw new Error('No output received from RunPod API');
    }

    // Handle RunPod response format
    let videoUrl;
    if (output.output) {
      videoUrl = output.output.video_url || output.output.url || output.output;
    } else if (output.data) {
      videoUrl = output.data.video_url || output.data.url || output.data;
    } else if (typeof output === 'string') {
      videoUrl = output;
    }

    console.log('Extracted video URL:', videoUrl);

    if (!videoUrl) {
      console.error('Could not extract video URL from output:', output);
      throw new Error('Could not extract video URL from RunPod response');
    }

    return new Response(
      JSON.stringify({
        success: true,
        videoUrl: videoUrl,
        message: 'Vidéo générée avec succès via RunPod!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in animate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: `Erreur lors de la génération: ${error.message}`,
        details: 'Vérifiez que la clé API RunPod est correctement configurée.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});