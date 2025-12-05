# Vercelでのデプロイガイド（フロントエンド + バックエンド）

このプロジェクトは、フロントエンド（Next.js）とバックエンド（FastAPI）の両方をVercelでデプロイします。

## デプロイ手順

### 1. Vercelプロジェクトの作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. 「Add New Project」をクリック
4. リポジトリ `nikoindulgence/potential-admin-tool-2` を選択

### 2. プロジェクト設定

Vercelが自動的に以下を検出します：
- **Framework Preset**: Next.js（フロントエンド）
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`（自動検出）
- **Output Directory**: `.next`（自動検出）

**重要**: Root Directoryは `frontend` のままにしてください。

### 3. 環境変数の設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

#### Clerk認証設定
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx または pk_live_xxx
CLERK_SECRET_KEY=sk_test_xxx または sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### Supabase設定（バックエンド用）
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
```

#### Clerk認証設定（バックエンド用）
```
CLERK_SECRET_KEY=sk_test_xxx または sk_live_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx または pk_live_xxx
CLERK_JWT_ISSUER=https://your-clerk-instance.clerk.accounts.dev
```

#### アプリケーション設定
```
DEBUG=false
APP_NAME=ポテンシャル採用評価ログシステム API
CORS_ORIGINS=["https://your-app.vercel.app"]
```

#### バックエンドAPI URL（オプション）
本番環境では `/api/v1` を直接使用するため、通常は設定不要です。
開発環境でローカルバックエンドを使う場合のみ：
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. デプロイ

1. 「Deploy」をクリック
2. Vercelが自動的にビルドとデプロイを開始します
3. デプロイ完了後、提供されたURL（例: `https://your-app.vercel.app`）でアクセス可能

### 5. デプロイ後の確認

1. **フロントエンド**: `https://your-app.vercel.app`
2. **バックエンドAPI**: `https://your-app.vercel.app/api/v1/health`
3. **APIドキュメント**: `https://your-app.vercel.app/api/docs`

## アーキテクチャ

- **フロントエンド**: Next.js（`frontend/`ディレクトリ）
  - VercelのNext.jsランタイムでデプロイ
  - `/api/v1/*` へのリクエストは自動的にFastAPI Serverless Functionにルーティング

- **バックエンド**: FastAPI（`backend/`ディレクトリ）
  - VercelのPython Serverless Functionsとしてデプロイ
  - `api/index.py` がエントリーポイント
  - MangumでFastAPIをASGIアプリケーションとしてラップ

## トラブルシューティング

### バックエンドAPIが404を返す場合

1. `vercel.json` の設定を確認
2. `api/index.py` が正しく配置されているか確認
3. `api/requirements.txt` に必要な依存関係が含まれているか確認

### 環境変数が読み込まれない場合

1. Vercelダッシュボードで環境変数が正しく設定されているか確認
2. 環境変数名にタイポがないか確認
3. 再デプロイを実行

### Pythonの依存関係エラー

1. `api/requirements.txt` を確認
2. 必要に応じて `backend/pyproject.toml` から依存関係を同期

## 注意事項

- VercelのServerless FunctionsはPython 3.9を使用します
- コールドスタート時間が発生する可能性があります（初回リクエスト時）
- タイムアウト制限: Hobbyプランは10秒、Proプランは60秒

