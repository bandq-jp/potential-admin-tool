# Clerk環境変数の取得方法

## 1. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY（公開キー）

### 取得手順

1. **Clerkダッシュボードにアクセス**
   - https://dashboard.clerk.com にログイン

2. **アプリケーションを選択**
   - 対象のアプリケーションを選択（まだ作成していない場合は「Create Application」で作成）

3. **API Keysページを開く**
   - 左サイドバーの「API Keys」をクリック
   - または、https://dashboard.clerk.com/last-active?path=api-keys に直接アクセス

4. **Publishable Keyをコピー**
   - 「Publishable key」セクションに表示されているキーをコピー
   - 形式: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`（テスト環境）
   - または: `pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`（本番環境）

### 使用場所
- **フロントエンド**（Next.js）で使用
- 環境変数名: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- このキーは公開されても問題ありません（ブラウザに表示されます）

---

## 2. CLERK_JWT_ISSUER（JWT発行者URL）

### 取得手順

1. **Clerkダッシュボードにアクセス**
   - https://dashboard.clerk.com にログイン

2. **アプリケーションを選択**

3. **JWT Templatesページを開く**
   - 左サイドバーの「JWT Templates」をクリック
   - または、https://dashboard.clerk.com/last-active?path=jwt-templates に直接アクセス

4. **Issuer URLを確認**
   - 「Issuer」フィールドに表示されているURLをコピー
   - 形式: `https://<your-clerk-subdomain>.clerk.accounts.dev`
   - 例: `https://clerk.your-app-name.clerk.accounts.dev`

### 別の方法（API Keysページから）

1. **API Keysページを開く**
   - https://dashboard.clerk.com/last-active?path=api-keys

2. **Frontend API URLを確認**
   - 「Frontend API」セクションに表示されているURL
   - このURLが `CLERK_JWT_ISSUER` の値になります
   - 形式: `https://<your-clerk-subdomain>.clerk.accounts.dev`

### 使用場所
- **バックエンド**（FastAPI）で使用
- 環境変数名: `CLERK_JWT_ISSUER`
- JWTトークンの検証時に使用されます

---

## 3. CLERK_SECRET_KEY（シークレットキー）

### 取得手順

1. **API Keysページを開く**
   - https://dashboard.clerk.com/last-active?path=api-keys

2. **Secret keyをコピー**
   - 「Secret keys」セクションに表示されているキーをコピー
   - 形式: `sk_test_` で始まる文字列（テスト環境）
   - または: `sk_live_` で始まる文字列（本番環境）
   - ⚠️ **重要**: このキーは秘密にしてください。公開しないでください。

### 使用場所
- **フロントエンド**（Next.js）と**バックエンド**（FastAPI）の両方で使用
- 環境変数名: `CLERK_SECRET_KEY`（バックエンド用）
- サーバーサイドでの認証処理に使用

---

## 環境変数の設定例

### フロントエンド（Vercel環境変数）

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### バックエンド（Vercel環境変数）

```
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_JWT_ISSUER=https://your-clerk-subdomain.clerk.accounts.dev
```

---

## よくある質問

### Q: テスト環境と本番環境の違いは？

- **テスト環境**: `pk_test_` / `sk_test_` で始まるキー
- **本番環境**: `pk_live_` / `sk_live_` で始まるキー
- 開発中はテスト環境のキーを使用してください

### Q: CLERK_JWT_ISSUERが見つからない

- API Keysページの「Frontend API」セクションを確認してください
- または、JWT Templatesページの「Issuer」フィールドを確認してください
- 通常は `https://<your-clerk-subdomain>.clerk.accounts.dev` の形式です

### Q: アプリケーションをまだ作成していない

1. Clerkダッシュボードで「Create Application」をクリック
2. アプリケーション名を入力（例: "potential-admin-tool"）
3. 認証方法を選択（Google OAuth、Email/Passwordなど）
4. 作成後、上記の手順でキーを取得

---

## 参考リンク

- Clerkダッシュボード: https://dashboard.clerk.com
- API Keysページ: https://dashboard.clerk.com/last-active?path=api-keys
- JWT Templatesページ: https://dashboard.clerk.com/last-active?path=jwt-templates
- Clerk公式ドキュメント: https://clerk.com/docs

