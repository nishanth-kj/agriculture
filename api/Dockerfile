# Use a lightweight Python base image with Python 3.12
FROM python:3.12-slim

# Copy uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set working directory
WORKDIR /app

# Copy dependency definition
COPY pyproject.toml .

# Install dependencies using uv into the system python
RUN uv pip install --system .

# Copy the entire app code into the container
COPY . .

# Collect static files (optional, commenting out as per original)
#RUN python manage.py collectstatic --noinput

# Expose the port that Django will run on
EXPOSE 8000

# Command to run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
