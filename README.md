# 数秘術占いアプリ

このプロジェクトは、メールアドレスから数秘術に基づいた今日の運勢を占うWebアプリケーションです。事前に生成されたデータに基づいて、詩的でポジティブなメッセージを表示します。

## 機能

*   メールアドレスの入力による数秘術計算
*   内面、環境、人間関係の3つの側面からの運勢表示
*   Twitterでの結果シェア機能

## セットアップ

1.  リポジトリをクローンします。

    ```bash
    git clone https://github.com/your-username/numerology-app.git
    cd numerology-app
    ```

2.  依存関係をインストールします。

    ```bash
    pnpm install
    ```

## 開発サーバーの起動

開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで [http://localhost:3000/numerology-app](http://localhost:3000/numerology-app) を開くと、アプリケーションが表示されます。

**注意:** `next dev` コマンドの出力には `http://localhost:3000` と表示されますが、`basePath` の設定により、実際には `/numerology-app` のパスが必要です。

## 技術スタック

*   Next.js
*   React
*   Tailwind CSS