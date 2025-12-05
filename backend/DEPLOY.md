# バックエンドデプロイガイド

## Railwayでのデプロイ（推奨・最も簡単）

### 1. Railwayアカウント作成
1. https://railway.app にアクセス
2. GitHubアカウントでサインアップ

### 2. プロジェクト作成
1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `nikoindulgence/potential-admin-tool-2` を選択
4. 「backend」ディレクトリを選択

### 3. 環境変数の設定
Railwayダッシュボードの「Variables」タブで以下を設定：

| 変数名 | 説明 | 取得場所 |
|--------|------|----------|
| `SUPABASE_URL` | SupabaseプロジェクトURL | Supabaseダッシュボード → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase匿名キー | Supabaseダッシュボード → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseサービスロールキー | Supabaseダッシュボード → Settings → API → service_role |
| `CLERK_SECRET_KEY` | Clerkシークレットキー | Clerkダッシュボード → API Keys → Secret keys |
| `CLERK_PUBLISHABLE_KEY` | Clerk公開キー | Clerkダッシュボード → API Keys → Publishable keys |
| `CLERK_JWT_ISSUER` | Clerk JWT発行者URL | Clerkダッシュボード → JWT Templates → Issuer URL |
| `CORS_ORIGINS` | CORS許可オリジン | VercelのフロントエンドURL（例: `["https://your-app.vercel.app"]`） |
| `DEBUG` | デバッグモード | 本番では `false` |

### 4. デプロイ
- Railwayが自動的にDockerfileを検出してビルド・デプロイします
- デプロイ完了後、Railwayが提供するURL（例: `https://your-app.up.railway.app`）を確認

### 5. フロントエンドの環境変数設定
Vercelの環境変数に以下を追加：

```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1
```

---

## Renderでのデプロイ（代替案）

### 1. Renderアカウント作成
1. https://render.com にアクセス
2. GitHubアカウントでサインアップ

### 2. 新しいWebサービス作成
1. 「New +」→「Web Service」を選択
2. リポジトリを接続
3. 設定：
   - **Name**: `potential-admin-tool-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. 環境変数の設定
Renderダッシュボードの「Environment」セクションで環境変数を設定（Railwayと同じ）

### 4. デプロイ
- Renderが自動的にデプロイします
- デプロイ完了後、URL（例: `https://your-app.onrender.com`）を確認

---

## Cloud Runでのデプロイ（GCP使用時）

### 前提条件
- Google Cloud Platformアカウント
- gcloud CLIインストール済み

### 手順
```bash
# プロジェクト設定
gcloud config set project YOUR_PROJECT_ID

# Dockerイメージをビルド
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/backend

# Cloud Runにデプロイ
gcloud run deploy backend \
  --image gcr.io/YOUR_PROJECT_ID/backend \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars "SUPABASE_URL=...,SUPABASE_ANON_KEY=..."
```

### フロントエンドの環境変数設定
Vercelの環境変数に以下を追加：

```
BACKEND_BASE_URL=https://your-app-xxx-xx.a.run.app/api/v1
BACKEND_IAM_AUDIENCE=https://your-app-xxx-xx.a.run.app
GCP_SA_JSON={...service account JSON...}
USE_LOCAL_BACKEND=false
```

---

## デプロイ後の確認

1. ヘルスチェック: `https://your-backend-url/api/v1/health`
2. APIドキュメント: `https://your-backend-url/api/docs`
3. フロントエンドからAPIが呼び出せることを確認

