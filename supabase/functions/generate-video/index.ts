import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating scenario with DeepSeek API for prompt:', prompt);
    
    // Generate scenario using DeepSeek API
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en création de scénarios visuels. Génère un court scénario de 3 scènes maximum pour une vidéo de 10-15 secondes. Chaque scène doit être courte et descriptive. Format : "Scène 1: [description]\\nScène 2: [description]\\nScène 3: [description]"'
          },
          {
            role: 'user',
            content: `Crée un scénario visuel basé sur ce prompt: "${prompt}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API error: ${deepseekResponse.status} - ${errorText}`);
    }

    const deepseekData = await deepseekResponse.json();
    const scenario = deepseekData.choices[0].message.content;
    
    console.log('Generated scenario:', scenario);
    
    return new Response(
      JSON.stringify({
        success: true,
        scenario,
        message: 'Scénario généré avec succès! Note: La génération complète de vidéos nécessite un serveur dédié avec FFmpeg installé.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-video function:', error.message);
    return new Response(
      JSON.stringify({ 
        error: `Erreur lors de la génération: ${error.message}`,
        details: 'Vérifiez que la clé API DeepSeek est correctement configurée.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});