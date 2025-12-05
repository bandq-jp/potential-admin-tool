"""
Vercel Serverless Function entry point for FastAPI
"""
import sys
import os

# バックエンドディレクトリをパスに追加
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from mangum import Mangum
from main import app

# MangumでFastAPIをASGIアプリケーションとしてラップ
handler = Mangum(app, lifespan="off")

