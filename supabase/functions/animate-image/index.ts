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
    const VYRO_API_KEY = Deno.env.get('VYRO_API_KEY');
    if (!VYRO_API_KEY) {
      throw new Error('VYRO_API_KEY is not set');
    }

    const { imageBase64, prompt, type = 'image-to-video', style = 'kling-1.0-pro' } = await req.json();

    console.log(`Starting ${type} generation with Vyro AI:`, prompt);
    
    let endpoint = '';
    const formData = new FormData();
    
    if (type === 'text-to-image') {
      endpoint = 'https://api.vyro.ai/v2/image/generations';
      formData.append('prompt', prompt || 'A beautiful landscape');
      formData.append('style', 'realistic');
      formData.append('aspect_ratio', '1:1');
      formData.append('seed', '5');
    } else if (type === 'text-to-video') {
      endpoint = 'https://api.vyro.ai/v2/video/text-to-video';
      formData.append('style', style);
      formData.append('prompt', prompt || 'a flying dinosaur');
    } else if (type === 'image-to-video') {
      if (!imageBase64) {
        return new Response(
          JSON.stringify({ error: 'Image is required for image-to-video' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      endpoint = 'https://api.vyro.ai/v2/video/image-to-video';
      formData.append('style', style);
      formData.append('prompt', prompt || 'animate this image');
      
      // Convert base64 to blob
      const imageData = imageBase64.startsWith('data:') ? imageBase64.split(',')[1] : imageBase64;
      const binaryData = atob(imageData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      formData.append('file', blob, 'image.jpg');
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Must be text-to-image, text-to-video, or image-to-video' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Calling Vyro AI API: ${endpoint}`);
    
    const vyroResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VYRO_API_KEY}`,
      },
      body: formData
    });

    console.log('Vyro Response status:', vyroResponse.status);
    
    if (!vyroResponse.ok) {
      const errorText = await vyroResponse.text();
      console.error('Vyro AI API error:', errorText);
      throw new Error(`Vyro AI API error: ${vyroResponse.status} ${errorText}`);
    }

    let result;
    
    if (type === 'text-to-image') {
      // For text-to-image, Vyro returns the image directly as binary data
      const imageBuffer = await vyroResponse.arrayBuffer();
      const bytes = new Uint8Array(imageBuffer);
      
      // Convert to base64 in chunks to avoid stack overflow
      let binaryString = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binaryString += String.fromCharCode(...chunk);
      }
      const base64Image = btoa(binaryString);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      
      result = {
        url: imageUrl,
        format: 'image/jpeg'
      };
      
      console.log('Text-to-image generated successfully');
    } else {
      // For video generation, Vyro returns JSON with job ID
      const vyroData = await vyroResponse.json();
      console.log('Vyro AI JSON response:', vyroData);
      
      if (vyroData.status === 'success' && vyroData.id) {
        // Poll for the video result using the correct endpoint
        const pollUrl = `https://api.vyro.ai/v2/video/status`;
        console.log('Polling for video result with ID:', vyroData.id);
        
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes max
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
          attempts++;
          
          const pollResponse = await fetch(pollUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${VYRO_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: vyroData.id })
          });
          
          if (pollResponse.ok) {
            const pollData = await pollResponse.json();
            console.log(`Poll attempt ${attempts}:`, pollData);
            
            if (pollData.status === 'completed' && pollData.video_url) {
              result = {
                url: pollData.video_url,
                format: 'video/mp4'
              };
              console.log('Video generation completed:', pollData.video_url);
              break;
            } else if (pollData.status === 'failed') {
              throw new Error(`Video generation failed: ${pollData.error || 'Unknown error'}`);
            }
            // If status is still 'processing', continue polling
          } else {
            console.log(`Poll attempt ${attempts} failed:`, pollResponse.status);
          }
        }
        
        if (!result.url) {
          throw new Error('Video generation timed out after 5 minutes');
        }
      } else {
        throw new Error(`Vyro AI returned unexpected response: ${JSON.stringify(vyroData)}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: result,
        type: type,
        message: `${type} généré avec succès via Vyro AI!`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in animate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: `Erreur lors de la génération: ${error.message}`,
        details: 'Vérifiez que la clé API Vyro est correctement configurée.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});