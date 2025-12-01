# ポテンシャル採用評価ログシステム - フロントエンド

Next.js 16 + MUI + Clerk による管理画面

## セットアップ

### 1. 依存関係のインストール

```bash
cd frontend
bun install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成:

```bash
cp env.example .env.local
```

各環境変数の取得方法:

| 環境変数 | 取得場所 |
|---------|---------|
| `NEXT_PUBLIC_API_URL` | バックエンドサーバーのURL（デフォルト: `http://localhost:8000/api/v1`） |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerkダッシュボード → API Keys → Publishable keys |
| `CLERK_SECRET_KEY` | Clerkダッシュボード → API Keys → Secret keys |

### 3. 開発サーバー起動

```bash
bun dev
```

http://localhost:3000 でアクセス

## ディレクトリ構造

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 認証ページ
│   └── dashboard/          # ダッシュボード画面群
├── components/
│   ├── dashboard/          # ダッシュボード用コンポーネント
│   ├── layout/             # レイアウトコンポーネント
│   └── providers/          # Provider コンポーネント
├── config/                 # 設定（MUIテーマ等）
├── domain/
│   └── entities/           # ドメインエンティティ（型定義）
├── hooks/                  # カスタムフック
├── infrastructure/
│   └── api/                # APIクライアント
└── lib/                    # ユーティリティ
```

## 主な機能

### ダッシュボード
- KPIカード（進行中候補者数、通過率、内定数、ミスマッチ）
- 選考ファネルチャート
- エージェント別パフォーマンスチャート
- 未入力面談ログ一覧

### 候補者管理
- 候補者一覧（フィルタ・検索）
- 候補者登録・編集
- 選考ステータス管理

### 0.5次面談評価
- 定性要件別スコアリング（◎/◯/△/×）
- 外向きコメント / 内部メモ
- Q&Aログ
- 文字起こしテキスト保存
- Will / アトラクトポイント
- レポート生成（クリップボードコピー）

### マスタ管理
- クライアント企業
- 求人ポジション
- 定性要件（大項目・中項目）
- エージェント

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **UIライブラリ**: MUI (Material UI)
- **認証**: Clerk
- **データフェッチ**: SWR
- **チャート**: Recharts
- **アイコン**: Lucide React
