# PoC機能要件作成

Status: In progress
Due Date: 2025年11月20日
Project: PoC提案 (https://www.notion.so/PoC-2af7cde203d480cba58bed0e379028aa?pvs=21)
Created by: bandq

---

# 【PoC開発】ポテンシャル採用評価ログシステム 要件定義書（最終版）

**作成日:** 2025年11月21日

**作成者:** 新規事業開発担当

**プロジェクト:** ポテンシャルCA採用イネーブルメント（0.5次面談）PoC

---

## 1. プロジェクト概要・目的

本プロジェクトは、人材紹介事業における**ポテンシャル人材の厳密な定性評価**を行うための

**0.5次面談ログ管理システム（社内向けAdminツール）**を開発するものである。

### 1.1 背景

- CAのポテンシャル採用で
    - 「ドンピシャで伸びた人」
    - 「早期退職・戦力化しない人」
        
        が混在しており、採用ミス1人あたり数百万円レベルのコストインパクトがある。
        
- 現状は、
    - 「元社名」「年数」「業界ラベル」といった表層情報
    - 面接官ごとの勘と経験
        
        に依存しており、**価値観・スタンス・行動パターン**が“OSとして”共有されていない。
        
- 特に、**同一企業内でも複数ポジション（例：CA新卒／CA中途／両面コンサル）で求める定性要件の濃淡が異なる**にもかかわらず、
    
    それが構造的に整理されていない。
    

### 1.2 開発のゴール

1. **構造化データの蓄積**
    - 0.5次面談の評価（スコア／外向きコメント／内部メモ）、質問・回答・仮説、オンライン面談の文字起こし、
        
        さらに一次〜最終〜入社／ミスマッチ情報をRDBに保存し、
        
        将来のAI活用・ベクトルDB構築とPoC検証の基盤とする。
        
2. **オペレーション効率化**
    - 0.5次面談後のレポート作成（クライアント提出用・エージェントFB用）の工数を削減。
    - 「内向きメモ」と「外向きコメント」を構造的に分け、レポート生成を半自動化する。
3. **最短・最安でのPoC運用**
    - クライアント向け画面は作成せず、社内運用者（Admin／Interviewer）のみ利用する。
    - ただし複数クライアント企業・複数ポジションのデータを**1環境で安全に管理**できる設計とする。
4. **PoCで検証したい指標を取得できる状態にする**
    - 0.5導入前後での一次〜最終の面接人数・面接工数の変化
    - 0.5評価スコアと、一次・最終・内定・入社・ミスマッチの相関
    - エージェント別の通過率／ミスマッチ率と、送客傾向の違い

### 1.3 採用技術スタック

- フロントエンド：Next.js 16 / React / TypeScript / shadcn/ui / Tailwind CSS
- バックエンド：FastAPI（Python）
- データベース：Supabase（PostgreSQL）
- JSランタイム／パッケージマネージャ：Bun（フロントエンド開発・ビルド）
- Pythonツールチェーン：uv（依存管理・実行）

---

## 2. 開発スコープ（Scope）

### 2.1 実装対象（In Scope）

- 社内運用者向け管理画面（PCブラウザのみ）
- アカウント／権限管理（Admin / Interviewer）
- クライアント企業マスタ管理（Companies）
- 求人ポジションマスタ管理（Job Positions）
- 定性要件マスタ管理（ポジションごと）
- エージェントマスタ管理
- 候補者・選考ステージ管理
- 0.5次面談 評価入力
    - ※前提：**1候補者×1企業×1ポジションにつき 0.5は1回だけ**
- 面談Q&A・仮説ログ管理
- オンライン面談の文字起こしテキストの保存（ASRは外部ツール依存、コピペで貼付）
- レポートテキスト生成（クライアント向け／エージェント向け、クリップボードコピー）
- 候補者一覧の検索・フィルタ・簡易ファネル表示
- 評価・選考データのCSVエクスポート

### 2.2 実装対象外（Out of Scope / Future Works）

- クライアント企業・エージェント用のログイン画面・ポータル
- ベクトル検索・Embedding・類似検索などのAI機能
    
    （今回はLLMやASRは**社外ツール・別プロセスで利用**。本システムには組み込まない）
    
- 複雑なPDF帳票出力（Markdown＋外部ツールで代替）
- スマホ対応（PC運用前提）
- 高度な分析ダッシュボード（PoCではCSVエクスポートと一覧上の件数表示まで）

---

## 3. 業務フローとシステム利用イメージ

1. **【初期設定】**
    - Adminがクライアント企業を登録。
    - 各企業ごとに、採用対象となる求人ポジション（例：CA新卒／CA中途／両面コンサル）を登録。
    - 経営者／現場／ハイパフォーマー等へのヒアリング（別プロセス）。
    - ヒアリングログを元に、人が**ポジション単位**で定性要件ピラミッド（大項目／中項目＋行動例）を設計。
    - その内容を本システムの「定性要件マスタ」として、各Job Positionに紐づけて登録。
2. **【エージェント・候補者準備】**
    - エージェント会社・担当者をマスタ登録。
    - 候補者情報を登録：
        - どの企業の、どのポジションに応募しているか（company + job_position）
        - エージェント
        - 履歴書URL 等
    - 選考ステージを「0.5予定」に設定。
    - 候補者には**主担当（owner_user）**を紐づける（Interviewer）。
3. **【0.5次面談実施（オンライン）】**
    - 全面談はオンライン（Zoom／Meet等）で実施。
    - 別ツールで自動文字起こしを取得（Zoom機能等）。
    - 面談中のメモはNotion等に取る。
4. **【面談後入力】**
    - 管理画面で対象候補者を選択し、
        - オンライン面談の文字起こしを貼り付け
        - 中項目ごとのスコア（◎／◯／△／×）
        - 外向きコメント／内部メモ
        - 質問・回答・仮説（Q&Aログ）
        - 全体所感（外向き＋内部メモ）
        - Will／アトラクト（外向き＋内部メモ）
            
            を入力。
            
    - 0.5結果（通過／見送り）を更新。
    
    ※前提：**1候補者×1企業×1ポジションにつき 0.5は1回**。やり直しが必要な場合は、
    
    別候補者レコードとして扱う or 既存レコードを上書き、の運用ルールで対応。
    
5. **【選考進行・結果反映】**
    - クライアントでの一次〜最終の進捗／結果が出るたびに、
        - 一次／二次／最終／内定／入社／辞退／ミスマッチ
            
            を候補者ごとに更新（ステージ＋日時）。
            
6. **【レポート出力・連携】**
    - 対象候補者の画面から、
        - 「クライアント向けレポートコピー」
        - 「エージェント向けFBコピー」
            
            ボタンでMarkdownテキストを生成し、Slack／メールに貼り付けて送付。
            
7. **【PoC振り返り・分析】**
    - 期間終了時にCSVをエクスポートし、
        - 0.5スコア×選考結果
        - エージェント別通過率
        - ポジション別の傾向
        - ミスマッチ削減状況
            
            などを外部ツール（Excel等）で分析。
            

---

## 4. 機能要件（Functional Requirements）

### A. アカウント・権限管理（Users）

ロールは**Admin と Interviewer の2種のみ**。

- **Admin**
    - 企業マスタ／ポジションマスタ／定性要件マスタ／エージェントマスタのCRUD
    - 全候補者・全面談ログ・Q&A・文字起こしの閲覧・編集
- **Interviewer**
    - 全候補者の閲覧は可能
    - ただし、**編集できるのは自分が owner_user の候補者のみ**
        - 候補者基本情報／0.5面談ログ／Q&A／文字起こし 等
- 認証：
    - Google Login または Email/Password 認証。
    - 未ログイン状態での画面アクセスはすべて禁止。

---

### B. クライアント企業マスタ管理（Companies）

- 企業の登録／編集：
    - name（企業名）
    - note（事業内容／採用方針／採用人数イメージ等）
- 各企業に紐づく：
    - JobPositions（求人ポジション）
    - Candidates（候補者）

---

### C. 求人ポジションマスタ管理（Job Positions）

**1企業内に複数ポジションを持てる前提。定性要件はポジション単位で設計。**

- フィールド例：
    - id
    - company_id
    - name（ポジション名：例「CA（新卒）」「CA（中途）」「両面コンサル」）
    - description（採用背景／ミッション等、任意）
    - is_active（有効／無効）
    - created_at, updated_at
- 候補者登録時には、必ず JobPosition を選択させる。

---

### D. 定性要件マスタ管理（Evaluation Criteria）

**3階層構造。スコア付与対象は中項目。
Criteria は JobPosition に紐づく。**

- 大項目（CriteriaGroup）
    - id, job_position_id, label, description, sort_order, created_at, updated_at, deleted_flag
- 中項目（CriteriaItem）※スコア対象
    - id, criteria_group_id
    - label（中項目名）
    - description（趣旨・説明）
    - behavior_examples_text（Good／Bad行動例を複数行テキストで保持）
    - sort_order
    - is_active
    - created_at, updated_at
- 要件：
    - 同一企業の別ポジション間で、異なる定性要件セットを持てること。
    - 変更は `is_active` 切り替えで対応（削除は原則行わない）。

---

### E. エージェントマスタ管理（Agents）

- エージェント会社／担当者を登録・編集：
    - id
    - company_name（エージェント会社名）
    - contact_name（担当者名）
    - contact_email（任意）
    - note
    - created_at, updated_at, deleted_flag
- 候補者登録時に、プルダウンで選択。
- エージェント別に、後から以下が集計できる構造にする：
    - 紹介人数
    - 0.5通過率
    - 最終内定率
    - ミスマッチ率

---

### F. 候補者・選考ステージ管理（Candidates & Selection）

- 候補者基本情報：
    - id
    - company_id（冗長だが検索用に保持）
    - job_position_id
    - agent_id
    - name（氏名）
    - resume_url
    - owner_user_id（主担当 Interviewer）
    - note
    - created_at, updated_at, deleted_flag
- 選考ステージ・結果：
    - stage_0_5_result：未実施／通過／見送り
    - stage_first_result：未実施／通過／見送り
    - stage_second_result：未実施／通過／見送り
    - stage_final_result：未実施／内定／見送り／辞退
    - hire_status：未決／入社／内定辞退
    - mismatch_flag：明らかなミスマッチ（在籍後）と判断した場合にON
- 各ステージの日時：
    - stage_0_5_date
    - stage_first_date
    - stage_final_decision_date
- 候補者一覧：
    - カラム：氏名／企業／ポジション／エージェント／0.5結果／一次結果／最終結果／入社有無／ミスマッチ 等
    - フィルタ：企業／ポジション／エージェント／owner_user／0.5結果／最終結果／期間
- 簡易ファネル：
    - 画面上部にステージ別件数（0.5実施数／0.5通過数／一次実施数／最終内定数 等）

---

### G. 0.5次面談 評価入力（Interviews / Assessments）

**前提：Candidates 1件につき Interviews は最大1件（1候補者×1企業×1ポジションで0.5は1回）。**

- 面談情報：
    - id
    - candidate_id
    - interviewer_id（=通常は owner_user）
    - interview_date
- 評価単位：CriteriaItem（中項目）ごと
- スコアリング仕様：
    - スケールは**4段階（◎／◯／△／×）**で固定。
    - DBには数値として保存する：
        - ◎ = 4
        - ◯ = 3
        - △ = 2
        - × = 1
    - フロントではラベル表示、CSV等では数値でも扱える。
- フィールド：
    - 全体所感：
        - overall_comment_external（外向き総合評価）
        - overall_comment_internal（内部メモ）
    - Will／アトラクト：
        - will_text_external
        - will_text_internal
        - attract_text_external
        - attract_text_internal

---

### H. 質問・回答・仮説ログ（Interview QuestionResponses）

- Interviews 1件に対し、複数の Q&A セットを持つ。
- フィールド：
    - id
    - interview_id
    - criteria_item_id（任意：どの定性要件を見た質問か）
    - question_text
    - answer_summary
    - hypothesis_text
    - transcript_reference（抜粋やタイムスタンプ等）
    - is_highlight（クライアント向けレポートに載せるかどうか）
    - created_at, updated_at
- UI：
    - 面談詳細画面で行追加／編集。
    - `is_highlight` にチェックしたものだけレポートの「主な質問と回答」に出す。

---

### I. オンライン面談の文字起こし（Transcript）

- ASRはZoom／Notta等、**外部ツール**で実施。
- 本システムで保持するのはテキストおよび参照情報のみ。
- Interviews に追加フィールド：
    - transcript_raw_text（全文コピペ）
    - transcript_source（Zoom / Notta / Meet 等）
    - transcript_url（外部ツールのURL、任意）
- 保持期間：
    - PoC時点では**保持期間に関するシステム要件は設けない**。
        
        削除要請が出た場合は、運用上の判断で対象レコードの transcript_raw_text を空にする等で対応（仕様外）。
        

---

### J. レポートテキスト生成（Reports）

- 生成パターン：
    1. クライアント提出用（推薦レポート）
    2. エージェント返却用（NGフィードバック）
- 共通要件：
    - 「クライアント向けコピー」「エージェント向けコピー」ボタン。
    - クリックでMarkdownテキスト生成＋クリップボードコピー。
    - 使用するデータは**外向きフィールドのみ**（内部メモは含めない）。
- クライアント向けレポート：
    
    候補者情報／0.5判定／ステータス／定性要件別評価／主なQ&A／Will・アトラクト を含む。
    
- エージェント向けレポート：
    
    候補者情報／0.5判定／お見送り理由／ギャップ要件／今後のご紹介のポイント を含む。
    

---

### K. データ閲覧・検索・エクスポート

- 一覧画面：
    - 検索・フィルタ：企業／ポジション／エージェント／owner_user／ステージ／期間 等
    - 簡易ファネルを表示
- CSVエクスポート：
    - 候補者1人＝1行。
    - 含める項目：
        - 候補者情報（氏名／企業／ポジション／エージェント／owner）
        - ステージ別結果・日付
        - 0.5スコア（中項目ごとの数値）
        - Will／アトラクト（外向き）
        - mismatch_flag
    - 文字コード：UTF-8（Excel想定）

---

## 5. データモデル概念（Schema Concept）

- **Users**
    - id, name, email, role (admin / interviewer), created_at, updated_at
- **Companies**
    - id, name, note, created_at, updated_at, deleted_flag
- **JobPositions**
    - id, company_id, name, description, is_active, created_at, updated_at
- **Agents**
    - id, company_name, contact_name, contact_email, note, created_at, updated_at, deleted_flag
- **CriteriaGroups**
    - id, job_position_id, label, description, sort_order, created_at, updated_at, deleted_flag
- **CriteriaItems**
    - id, criteria_group_id, label, description, behavior_examples_text, sort_order, is_active, created_at, updated_at
- **Candidates**
    - id, company_id, job_position_id, agent_id, name, resume_url, owner_user_id, note,
        
        stage_0_5_result, stage_first_result, stage_second_result, stage_final_result,
        
        hire_status, mismatch_flag,
        
        stage_0_5_date, stage_first_date, stage_final_decision_date,
        
        created_at, updated_at, deleted_flag
        
- **Interviews**
    - id, candidate_id, interviewer_id, interview_date,
        
        overall_comment_external, overall_comment_internal,
        
        will_text_external, will_text_internal,
        
        attract_text_external, attract_text_internal,
        
        transcript_raw_text, transcript_source, transcript_url,
        
        client_report_markdown (optional), agent_report_markdown (optional),
        
        created_at, updated_at
        
- **InterviewDetails**
    - id, interview_id, criteria_item_id,
        
        score_value(1–4),
        
        comment_external, comment_internal,
        
        created_at, updated_at
        
- **InterviewQuestionResponses**
    - id, interview_id, criteria_item_id (nullable),
        
        question_text, answer_summary, hypothesis_text,
        
        transcript_reference, is_highlight,
        
        created_at, updated_at
        

---

## 6. 非機能要件（Non-Functional Requirements）

- 技術スタック：
    - 管理画面：Next.js 16（React / TypeScript）＋ shadcn/ui ＋ Tailwind CSS
    - JSランタイム／パッケージ管理：Bun
    - バックエンド：FastAPI（Python）
    - DB：Supabase（PostgreSQL）
    - Pythonパッケージ管理：uv
- UI：
    - 管理画面テンプレ（MUI / Ant Design / Tailwind UI等）活用、独自デザイン最小。
- 認証・セキュリティ：
    - 認証必須（Google OAuth or Email/Password）。
    - company_id / job_position_id を基点に、将来的なRLS拡張が可能なスキーマにする。
- パフォーマンス：
    - PoCでは候補者〜数百件、面談ログ〜数百件を想定。
        
        その規模でストレスなく動作。
        
- ログ：
    - 重要更新は updated_at と updated_by（実装できれば）で追跡可能にする。

---
