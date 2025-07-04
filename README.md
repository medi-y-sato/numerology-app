# 数秘術占いアプリ

このプロジェクトは、メールアドレスから数秘術に基づいた今日の運勢を占うWebアプリケーションです。事前に生成されたデータに基づいて、詩的でポジティブなメッセージを表示します。

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
    `.env.local` ファイルを作成します。

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