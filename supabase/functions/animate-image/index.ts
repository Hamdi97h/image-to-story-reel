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
    
    // RunPod requires a specific endpoint ID - this needs to be configured
    const RUNPOD_ENDPOINT_ID = 'your-endpoint-id'; // This should be set as an environment variable
    const runpodUrl = `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/runsync`;
    
    const runpodResponse = await fetch(runpodUrl, {
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
          seed: Math.floor(Math.random() * 1000000),
          fps: 8,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          decoding_t: 7
        }
      })
    });

    console.log('RunPod Response status:', runpodResponse.status);
    console.log('RunPod Response headers:', Object.fromEntries(runpodResponse.headers.entries()));
    
    if (!runpodResponse.ok) {
      const errorText = await runpodResponse.text();
      console.error('RunPod API error:', errorText);
      throw new Error(`RunPod API error: ${runpodResponse.status} ${errorText}`);
    }

    // Get response as text first to debug
    const responseText = await runpodResponse.text();
    console.log('RunPod raw response:', responseText);
    
    let output;
    try {
      output = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse RunPod response as JSON:', parseError);
      console.error('Raw response was:', responseText);
      throw new Error(`Invalid JSON response from RunPod: ${parseError.message}`);
    }
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