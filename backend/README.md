# ポテンシャル採用評価ログシステム - バックエンドAPI

FastAPI + Supabase (PostgreSQL) によるバックエンドAPI

## セットアップ

### 1. 依存関係のインストール

```bash
cd backend
uv sync
```

### 2. 環境変数の設定

`.env` ファイルを作成:

```bash
cp env.example .env
```

各環境変数の取得方法:

| 環境変数 | 取得場所 |
|---------|---------|
| `SUPABASE_URL` | Supabaseダッシュボード → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabaseダッシュボード → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseダッシュボード → Settings → API → service_role |
| `CLERK_SECRET_KEY` | Clerkダッシュボード → API Keys → Secret keys |
| `CLERK_PUBLISHABLE_KEY` | Clerkダッシュボード → API Keys → Publishable keys |
| `CLERK_JWT_ISSUER` | Clerkダッシュボード → JWT Templates → Issuer URL |

### 3. データベースマイグレーション

Supabaseダッシュボードで `supabase/migrations/001_initial_schema.sql` を実行してください。

### 4. 開発サーバー起動

```bash
uv run uvicorn main:app --reload --port 8000
```

APIドキュメント: http://localhost:8000/api/docs

## ディレクトリ構造

```
backend/
├── app/
│   ├── api/v1/endpoints/   # APIエンドポイント
│   ├── application/
│   │   ├── dto/            # Data Transfer Objects
│   │   └── services/       # ユースケース・サービス
│   ├── core/               # 設定・DI・認証
│   ├── domain/
│   │   └── entities/       # ドメインエンティティ
│   └── infrastructure/
│       └── repositories/   # リポジトリ実装
├── main.py                 # FastAPIアプリケーション
└── pyproject.toml
```

## API概要

### 認証
- Clerk JWTによる認証
- `Authorization: Bearer <token>` ヘッダーが必要

### エンドポイント

| パス | 説明 |
|------|------|
| `/api/v1/health` | ヘルスチェック |
| `/api/v1/users` | ユーザー管理 |
| `/api/v1/companies` | 企業マスタ |
| `/api/v1/job-positions` | 求人ポジション |
| `/api/v1/agents` | エージェントマスタ |
| `/api/v1/criteria` | 定性要件マスタ |
| `/api/v1/candidates` | 候補者管理 |
| `/api/v1/interviews` | 0.5次面談評価 |
| `/api/v1/reports` | レポート生成 |
| `/api/v1/export` | CSVエクスポート |

