# Cloud Run friendly Dockerfile using python:3.12-slim and uv (lockfile依存)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# 必要最低限の OS 依存パッケージ（HTTPS用）
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# 依存解決（uv を pip で導入し、uv.lock に基づき system site-packages にインストール）
COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir uv \
  && uv pip install --system --frozen

# アプリコード
COPY app ./app
COPY main.py .
COPY supabase ./supabase

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--proxy-headers", "--forwarded-allow-ips", "*"]
