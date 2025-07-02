# 数秘術占いアプリ

このプロジェクトは、メールアドレスから数秘術に基づいた今日の運勢を占うWebアプリケーションです。Google Gemini APIを利用して、詩的でポジティブなメッセージを生成します。

## 機能

*   メールアドレスの入力による数秘術計算
*   内面、環境、人間関係の3つの側面からの運勢表示
*   Google Gemini APIによる占い結果の生成
*   `GEMINI_API_KEY` が設定されていない場合のフォールバック表示
*   Twitterでの結果シェア機能

## セットアップ

1.  リポジリをクローンします。

    ```bash
    git clone https://github.com/your-username/numerology-app.git
    cd numerology-app
    ```

2.  依存関係をインストールします。

    ```bash
    pnpm install
    ```

3.  環境変数を設定します。
    `.env.local` ファイルを作成し、Google Gemini APIキーを設定します。

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    **注意:** `GEMINI_API_KEY` が設定されていない場合でも、アプリは基本的な占い結果（対象、キーワード、天気マーク）を表示します。

## 開発サーバーの起動

開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## 技術スタック

*   Next.js
*   React
*   Tailwind CSS
*   Google Gemini API