# ユーザーが自動作成されない問題のトラブルシューティング

ログインしてもusersテーブルが空のままの場合の対処法です。

## 確認手順

### 1. ブラウザの開発者ツールでエラーを確認

1. ブラウザの開発者ツール（F12）を開く
2. 「Console」タブでエラーを確認
3. 「Network」タブで `/api/v1/users/me` へのリクエストを確認
   - リクエストが送信されているか
   - レスポンスのステータスコード（200, 401, 403, 500など）
   - エラーメッセージの内容

### 2. バックエンドAPIの動作確認

#### ローカル環境の場合

```bash
# バックエンドを起動
cd backend
uv run uvicorn main:app --reload --port 8000

# 別のターミナルでヘルスチェック
curl http://localhost:8000/api/v1/health
```

#### Vercel環境の場合

1. Vercelダッシュボードの「Functions」タブを確認
2. `/api/v1/users/me` のログを確認
3. エラーログがあれば内容を確認

### 3. 環境変数の確認

Vercelの環境変数が正しく設定されているか確認：

**必須の環境変数：**
- `CLERK_SECRET_KEY` - Clerkのシークレットキー
- `CLERK_JWT_ISSUER` - Clerk JWT発行者URL
- `SUPABASE_URL` - SupabaseプロジェクトURL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabaseサービスロールキー

### 4. メールアドレスのドメイン確認

システムは `@bandq.jp` ドメインのメールアドレスのみを許可しています。

**確認方法：**
- Clerkダッシュボードでユーザーのメールアドレスを確認
- `@bandq.jp` で終わっているか確認

**問題がある場合：**
- `backend/app/core/deps.py` の `ALLOWED_EMAIL_DOMAIN` を変更
- または、Clerkで `@bandq.jp` のメールアドレスでユーザーを作成

### 5. Supabaseのテーブル構造確認

Supabaseダッシュボードで以下を確認：

```sql
-- usersテーブルの構造を確認
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

**必要なカラム：**
- `id` (UUID, PRIMARY KEY)
- `clerk_id` (VARCHAR, UNIQUE, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `role` (VARCHAR, NOT NULL, DEFAULT 'interviewer')
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

### 6. 手動でユーザーを作成（一時的な対処）

問題が解決しない場合、手動でユーザーを作成：

```sql
-- Supabase SQL Editorで実行
INSERT INTO users (clerk_id, name, email, role)
VALUES (
  'user_xxxxxxxxxxxxx',  -- Clerkダッシュボードから取得したClerk ID
  'テストユーザー',
  'test@bandq.jp',
  'admin'
);
```

## よくある問題と解決方法

### 問題1: 401 Unauthorized エラー

**原因**: 認証トークンが正しく送信されていない

**解決方法**:
1. Clerkの環境変数が正しく設定されているか確認
2. ブラウザの開発者ツールで認証トークンが含まれているか確認
3. ログアウトして再度ログイン

### 問題2: 403 Forbidden エラー

**原因**: メールアドレスのドメインが許可されていない

**解決方法**:
1. Clerkで `@bandq.jp` のメールアドレスを使用
2. または、`backend/app/core/deps.py` の `ALLOWED_EMAIL_DOMAIN` を変更

### 問題3: 500 Internal Server Error

**原因**: バックエンドAPIのエラー

**解決方法**:
1. Vercelのログを確認
2. Supabaseの接続設定を確認
3. Clerk APIキーが正しいか確認

### 問題4: リクエストが送信されない

**原因**: フロントエンドがAPIを呼び出していない

**解決方法**:
1. ダッシュボードページにアクセス（`/dashboard`）
2. `useCurrentUser` フックが使用されているページにアクセス
3. ブラウザの開発者ツールでネットワークリクエストを確認

## デバッグ用のコード追加

問題を特定するために、フロントエンドにエラーログを追加：

```typescript
// frontend/src/hooks/useCurrentUser.ts に追加
const { data, error, isLoading, mutate } = useSWR<CurrentUser>(
  isLoaded && isSignedIn ? 'current-user' : null,
  async () => {
    const token = await getToken();
    if (!token) {
      console.error('No token available');
      throw new Error('No token');
    }
    console.log('Fetching current user with token:', token.substring(0, 20) + '...');
    try {
      const user = await api.get<CurrentUser>('/users/me', token);
      console.log('User fetched:', user);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
);
```

## 次のステップ

1. 上記の確認手順を実行
2. エラーメッセージを確認
3. 必要に応じて環境変数や設定を修正
4. 再デプロイして確認

問題が解決しない場合は、エラーメッセージの詳細を共有してください。

