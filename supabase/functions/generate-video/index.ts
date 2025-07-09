import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageFile } = await req.json();
    
    if (!prompt || !imageFile) {
      return new Response(
        JSON.stringify({ error: 'Prompt and image file are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating scenario with DeepSeek API...');
    
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
            content: 'You are a creative video scriptwriter. Create a simple 3-scene video script based on the user prompt. Each scene should be 1-2 short sentences. Return only the script text, one scene per line, without scene numbers or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!deepseekResponse.ok) {
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
    }

    const deepseekData = await deepseekResponse.json();
    const scenario = deepseekData.choices[0].message.content;
    
    console.log('Generated scenario:', scenario);

    // Convert base64 image to file
    const imageBuffer = Uint8Array.from(atob(imageFile.split(',')[1]), c => c.charCodeAt(0));
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    
    // Create temporary files
    const tempDir = await Deno.makeTempDir();
    const imagePath = `${tempDir}/input.jpg`;
    const videoPath = `${tempDir}/output.mp4`;
    
    // Write image to temp file
    await Deno.writeFile(imagePath, imageBuffer);
    
    // Split scenario into scenes
    const scenes = scenario.split('\n').filter(line => line.trim()).slice(0, 3);
    
    // Create FFmpeg command for video generation
    const duration = 5; // 5 seconds per scene
    const totalDuration = scenes.length * duration;
    
    // Create video with animated text
    let filterComplex = `[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720[bg];`;
    
    scenes.forEach((scene, index) => {
      const startTime = index * duration;
      const text = scene.trim().replace(/'/g, "\\'");
      
      filterComplex += `[bg]drawtext=text='${text}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,${startTime},${startTime + duration})'`;
      
      if (index < scenes.length - 1) {
        filterComplex += `[v${index}];[v${index}]`;
      }
    });
    
    const ffmpegCommand = [
      'ffmpeg',
      '-loop', '1',
      '-i', imagePath,
      '-filter_complex', filterComplex,
      '-t', totalDuration.toString(),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      '-y',
      videoPath
    ];
    
    console.log('Running FFmpeg command:', ffmpegCommand.join(' '));
    
    // Execute FFmpeg
    const ffmpegProcess = new Deno.Command('ffmpeg', {
      args: ffmpegCommand.slice(1),
      stdout: 'piped',
      stderr: 'piped'
    });
    
    const ffmpegResult = await ffmpegProcess.output();
    
    if (!ffmpegResult.success) {
      const error = new TextDecoder().decode(ffmpegResult.stderr);
      console.error('FFmpeg error:', error);
      throw new Error(`FFmpeg failed: ${error}`);
    }
    
    // Read generated video
    const videoBuffer = await Deno.readFile(videoPath);
    
    // Upload to Supabase storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const fileName = `video_${Date.now()}.mp4`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
    
    // Cleanup temp files
    await Deno.remove(tempDir, { recursive: true });
    
    return new Response(
      JSON.stringify({
        success: true,
        scenario,
        videoUrl: publicUrl,
        fileName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-video function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});