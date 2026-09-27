FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Git
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Create model directory
RUN mkdir -p /app/models

# Download embedding model during image build
RUN python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='BAAI/bge-small-en-v1.5', local_dir='/app/models/bge-small-en-v1.5')"

# Copy application
COPY . .

# Start FastAPI
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]