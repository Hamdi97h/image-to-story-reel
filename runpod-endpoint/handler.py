import runpod
import torch
import base64
import io
import numpy as np
from PIL import Image
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import load_image, export_to_video
import tempfile
import os

# Initialize the model
device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt", 
    torch_dtype=torch.float16, 
    variant="fp16"
)
pipe.to(device)

def generate_video(job):
    """
    Generate video from image and prompt
    """
    try:
        # Get input parameters
        input_data = job['input']
        image_base64 = input_data.get('image')
        prompt = input_data.get('prompt', '')
        duration = input_data.get('duration', 10)
        seed = input_data.get('seed', 42)
        fps = input_data.get('fps', 8)
        motion_bucket_id = input_data.get('motion_bucket_id', 127)
        cond_aug = input_data.get('cond_aug', 0.02)
        decoding_t = input_data.get('decoding_t', 7)
        
        if not image_base64:
            return {"error": "No image provided"}
        
        # Decode base64 image
        if image_base64.startswith('data:image'):
            image_base64 = image_base64.split(',')[1]
        
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Resize image to 1024x576 (required for Stable Video Diffusion)
        image = image.resize((1024, 576))
        
        # Set random seed
        generator = torch.manual_seed(seed)
        
        # Calculate number of frames from duration and fps
        num_frames = min(int(duration * fps), 25)  # Max 25 frames for SVD
        
        # Generate video frames
        frames = pipe(
            image, 
            decode_chunk_size=decoding_t,
            generator=generator,
            motion_bucket_id=motion_bucket_id,
            noise_aug_strength=cond_aug,
            num_frames=num_frames
        ).frames[0]
        
        # Create temporary file for video
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
            video_path = temp_file.name
        
        # Export frames to video
        export_to_video(frames, video_path, fps=fps)
        
        # Convert video to base64 for return (or upload to storage)
        with open(video_path, 'rb') as video_file:
            video_base64 = base64.b64encode(video_file.read()).decode()
        
        # Clean up temp file
        os.unlink(video_path)
        
        # Return video URL or base64 data
        # For production, you'd upload to cloud storage and return URL
        video_url = f"data:video/mp4;base64,{video_base64}"
        
        return {
            "output": {
                "video_url": video_url,
                "frames_generated": len(frames),
                "duration": duration,
                "fps": fps
            }
        }
        
    except Exception as e:
        return {"error": f"Video generation failed: {str(e)}"}

# Start the RunPod handler
runpod.serverless.start({"handler": generate_video})