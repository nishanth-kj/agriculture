# Use a lightweight Python base image with Python 3.12
FROM python:3.12-slim

# Copy uv from the official image
# Install uv via pip
# Install uv via pip
RUN pip install uv
# Default to CPU; can be overridden at runtime
ENV USE_GPU=false
# Increase timeout for downloading large dependencies (like torch/cuda)
ENV UV_HTTP_TIMEOUT=1200
# Suppress warning about hardlinks during build
ENV UV_LINK_MODE=copy
# Set HuggingFace cache directory
ENV HF_HOME=/app/.cache/huggingface
# Compile python bytecode for faster startup
ENV UV_COMPILE_BYTECODE=1

# Set working directory
WORKDIR /app

# Copy dependency definition
COPY pyproject.toml uv.lock ./

# Install dependencies using uv into the system python
# Use --frozen to respect lockfile
RUN uv sync --frozen

# Update PATH to use virtual environment if uv created one (optional with --system, but good practice)
ENV PATH="/app/.venv/bin:$PATH"

# Copy the entire app code into the container
COPY . .

# Pre-download models to avoid timeouts on Render
RUN uv run python download_models.py

# Collect static files (optional, commenting out as per original)
RUN uv run python manage.py collectstatic --noinput

# Expose the port that Django will run on
EXPOSE 8000

# Command to run the Django server
# Use gunicorn for production as it binds to the port quickly
# Use --timeout 120 as model loading can still be slow on first request
CMD ["sh", "-c", "uv run gunicorn agri_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000} --timeout 120"]
