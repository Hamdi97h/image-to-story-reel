# Use Ubuntu base image with CUDA support
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    git \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY runpod-endpoint/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy handler code
COPY runpod-endpoint/handler.py .

# Expose port
EXPOSE 8000

# Set the handler
CMD ["python3", "-u", "handler.py"]