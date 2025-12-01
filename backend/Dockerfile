# Multi-stage build using uv for dependency management
# Stage 1: build virtualenv with uv (image variant that ships /bin/sh)
FROM ghcr.io/astral-sh/uv:python3.12-bookworm AS builder
WORKDIR /app

# Leverage uv's resolver cache
COPY pyproject.toml uv.lock ./
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_PREFERENCE=system
RUN uv sync --frozen --no-dev --python /usr/bin/python3.12

# Stage 2: slim runtime image
FROM python:3.12-slim AS runner
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System packages: ca-certificates for HTTPS
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy prebuilt virtualenv from builder
COPY --from=builder /app/.venv /app/.venv

# Application code
COPY app ./app
COPY main.py .
COPY supabase ./supabase

# Cloud Run listens on $PORT (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${PORT}"]
