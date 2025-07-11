# RunPod Video Generation Endpoint

This repository contains the code for a RunPod serverless endpoint that generates videos from images using Stable Video Diffusion.

## Setup Instructions

1. **Create a new RunPod Serverless Endpoint**:
   - Go to [RunPod Console](https://www.runpod.io/console/serverless)
   - Click "New Endpoint"
   - Select "Source: GitHub Repo"

2. **Configure the endpoint**:
   - Repository URL: `https://github.com/yourusername/your-repo-name`
   - Branch: `main`
   - Docker Build Arguments: (leave empty)
   - Container Start Command: (leave empty, uses Dockerfile CMD)

3. **Hardware Configuration**:
   - GPU: RTX 4090 or A100 (recommended)
   - CPU: 8+ vCPUs
   - RAM: 32GB+
   - Container Disk: 50GB+

4. **Environment Variables** (if needed):
   - `HUGGING_FACE_HUB_TOKEN`: Your HF token for private models

5. **Test the endpoint**:
   ```json
   {
     "input": {
       "image": "base64_encoded_image_data",
       "prompt": "A cat walking in the garden",
       "duration": 10,
       "seed": 42,
       "fps": 8,
       "motion_bucket_id": 127,
       "cond_aug": 0.02,
       "decoding_t": 7
     }
   }
   ```

## Expected Output

```json
{
  "output": {
    "video_url": "data:video/mp4;base64,encoded_video_data",
    "frames_generated": 25,
    "duration": 10,
    "fps": 8
  }
}
```

## Files

- `Dockerfile`: Container configuration
- `requirements.txt`: Python dependencies
- `handler.py`: Main handler function
- `README.md`: Setup instructions

## Notes

- The model will be downloaded on first run (~7GB)
- Cold start times may be 30-60 seconds
- For production, consider uploading videos to cloud storage instead of base64 encoding