# AGENTS

開発メンバー向けの実装方針メモ。READMEの要件を前提に、最新の技術選定とアーキテクチャの守備範囲を明確にする。

## 技術スタック / 禁止事項
- UIは MUI (Material UI) を正とし、shadcn/ui は使用しない。
- 認証は Clerk を使用（Google OAuth / Email / Password 等）。NextAuth など別実装は避ける。
- フロントエンド：Next.js 16 / React / TypeScript / MUI / Tailwind CSS（ユーティリティ用途のみ）。
- バックエンド：FastAPI + Supabase（PostgreSQL）。

## アーキテクチャ指針（DDD + クリーン）
- 依存方向は プレゼンテーション → アプリケーション → ドメイン。インフラは内側に依存し、逆方向の参照は禁止。
- フロントエンド:
  - `src/domain`: エンティティ・値オブジェクト・ドメインサービス（純TypeScript）。
  - `src/application`: ユースケース／サービス（React非依存、DI前提）。
  - `src/infrastructure`: APIクライアント、Repository実装、Clerk/Supabaseアダプタ。
  - `src/features`: コンテキスト単位のUI組み立てと状態管理（application層を呼ぶ）。
  - `src/app` / `src/components`: プレゼンテーション層（Next.js App Router、共通UI、MUIテーマ）。
  - `src/lib` / `src/config`: 横断的なユーティリティと設定。
- バックエンド:
  - `app/domain`: ドメインモデル・ドメインサービス。
  - `app/application`: ユースケース・サービス・DTO。
  - `app/infrastructure`: Repository実装、Supabase/PostgreSQL・外部APIクライアント。
  - `app/api`: FastAPIエンドポイント（プレゼンテーション層）。
  - `app/core`: 設定・DI・共通基盤。

## 実装メモ
- MUI: テーマ設定を中央集約し、コンポーネントは `@mui/material` / `@mui/x-data-grid` を優先。Tailwindは補助的に利用し、デザインソースはMUIテーマに寄せる。
- Clerk: Next.js側では `@clerk/nextjs` の Provider / middleware を用いてルート保護し、サーバー処理では `auth()` 経由でユーザーを特定する。バックエンドからは Clerk JWT を検証して権限を判定する方針。
- テスト: ドメイン層は純粋ロジックとして単体テスト、アプリケーション層はユースケース単位でインフラをモック、プレゼンテーション層は主要フローをE2Eで担保する。

